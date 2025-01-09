import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';
import logo from '../images/logo.png';
import { useStartSim } from '../contexts/DataRefreshContext';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRole } from '../contexts/RoleContext';

export default function Map({ location, zoom, minZoom, maxZoom, overview }) {
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const [markersVisible, setMarkersVisible] = useState(false);
    const markersRef = useRef([]);
    const bikesRef = useRef([]);
    const citiesRef = useRef([]);
    const [cities, setCities] = useState([]);
    const { startSim } = useStartSim();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const { setRole } = useRole();
    const token = user.accessToken;

    const long = parseFloat(location.longitude);
    const lat = parseFloat(location.latitude);

    const isTestEnvironment = import.meta.env.NODE_ENV === 'test';

    useEffect(() => {
        const getCities = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/cities', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCities(res.data);
            } catch (error) {
                console.log(error);
                await signOut();
                setRole(null);
                navigate('/');
            }
        };
        getCities();
    }, []);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [long, lat],
            zoom: zoom,
            minZoom: minZoom,
            maxZoom: maxZoom,
            pitch: 20,
            style: 'mapbox://styles/mapbox/standard',
        });

        mapRef.current.on('style.load', () => {
            mapRef.current.setConfigProperty('basemap', 'lightPreset', 'dusk');
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [location]);

    useEffect(() => {
        let zoomThresholdCrossed = false;

        const zoomListener = () => {
            const newZoom = mapRef.current.getZoom();

            if (newZoom >= 10 && !zoomThresholdCrossed) {
                setMarkersVisible(true);
                zoomThresholdCrossed = true;
            } else if (newZoom < 10 && zoomThresholdCrossed) {
                setMarkersVisible(false);
                zoomThresholdCrossed = false;
            }
        };

        if (mapRef.current) {
            mapRef.current.on('zoom', zoomListener);
        }

        if (markersVisible) {
            if (overview) {
                const getBikes = async () => {
                    const bikes = await axios.get('http://localhost:8000/api/bikes', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const chargingStations = await axios.get('http://localhost:8000/api/chargingstations', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const parkingAreas = await axios.get('http://localhost:8000/api/parkingareas', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    let chargingCounter = {};
                    chargingStations.data.forEach((chargingstation) => {
                        chargingCounter[chargingstation._id] = 0;
                    });

                    let parkingCounter = {};
                    parkingAreas.data.forEach((parkingarea) => {
                        parkingCounter[parkingarea._id] = 0;
                    });

                    bikes.data.forEach((bike) => {
                        const markerElement = document.createElement('div');
                        markerElement.style.display = 'none'; // Initially hidden
                        markerElement.dataset.bikeId = bike._id;

                        let chargeColor =
                            bike.charge >= 70 ? 'green' : bike.charge >= 50 ? '#FDCE06' : bike.charge >= 30 ? '#EB841F' : '#D61E2A';

                        const popup = new mapboxgl.Popup({ closeOnMove: true }).setHTML(`
                            <div>
                                <h3>${bike._id}</h3>
                                <div class="popup-body">
                                    <p><strong>Position:</strong> ${bike.location.latitude}, ${bike.location.longitude}</p>
                                    <p><strong>Laddning:</strong> ${bike.charge}%</p>
                                    <p><strong>Tillgänglig:</strong> ${bike.available ? 'Ja' : 'Nej'}</p>
                                </div>
                            </div>
                        `);

                        // ✅ Create the marker once
                        const root = ReactDOM.createRoot(markerElement);
                        let offset = 0; // Offset for transformation adjustment

                        // ✅ Determine offset and visibility before rendering
                        if (bike.chargingStationId && chargingCounter[bike.chargingStationId] <= 4) {
                            offset = chargingCounter[bike.chargingStationId]++;
                            markerElement.style.display = 'block';
                        } else if (bike.parkingAreaId && parkingCounter[bike.parkingAreaId] <= 4) {
                            offset = parkingCounter[bike.parkingAreaId]++;
                            markerElement.style.display = 'block';
                        } else if (!bike.parkingAreaId && !bike.chargingStationId) {
                            markerElement.style.display = 'block';
                        }

                        // ✅ Perform a SINGLE render after conditions
                        root.render(
                            <TbScooter
                                style={{
                                    backgroundColor: chargeColor,
                                    transform: `translate(${-5 + offset * 3}px, 20px)`,
                                }}
                                size={30}
                                color='black'
                                className='scooter-icon'
                            />
                        );

                        // ✅ Create the marker once
                        const marker = new mapboxgl.Marker({ element: markerElement })
                            .setLngLat([bike.location.longitude, bike.location.latitude])
                            .setPopup(popup)
                            .addTo(mapRef.current);

                        bikesRef.current.push(marker); // ✅ Pushing only once
                    });
                };

                const getParkingAreas = async () => {
                    try {
                        const res = await axios.get('http://localhost:8000/api/parkingareas', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        res.data.forEach((parkingArea) => {
                            const popup = new mapboxgl.Popup({
                                closeOnMove: true,
                            }).setHTML(
                                `<div>
                                <h3>${parkingArea.name}</h3>
                                <div class="popup-body">
                                    <p><strong>Antal elsparkcyklar:</strong> ${parkingArea.bikes.length}</p>
                                </div>
                            </div>`
                            );

                            const markerElement = document.createElement('div');

                            const root = ReactDOM.createRoot(markerElement);
                            root.render(<TbParking className='parking-icon' size={50} color='white' fill='#0271c0' />);

                            const marker = new mapboxgl.Marker({ element: markerElement })
                                .setLngLat([parkingArea.location.longitude, parkingArea.location.latitude])
                                .addTo(mapRef.current)
                                .setPopup(popup);
                            markersRef.current.push(marker);
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        getChargingStations();
                    }
                };

                const getChargingStations = async () => {
                    try {
                        const res = await axios.get('http://localhost:8000/api/chargingstations', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        res.data.forEach((chargingStation) => {
                            const popup = new mapboxgl.Popup({
                                closeOnMove: true,
                            }).setHTML(
                                `<div>
                                <h3>${chargingStation.name}</h3>
                                <div class="popup-body">
                                    <p><strong>Antal elsparkcyklar:</strong> ${chargingStation.bikes.length}</p>
                                </div>
                            </div>`
                            );

                            const markerElement = document.createElement('div');

                            const root = ReactDOM.createRoot(markerElement);
                            root.render(<TbChargingPile className='charging-icon' size={50} fill='#41ab5d' />);

                            const marker = new mapboxgl.Marker({ element: markerElement })
                                .setLngLat([chargingStation.location.longitude, chargingStation.location.latitude])
                                .addTo(mapRef.current)
                                .setPopup(popup);
                            markersRef.current.push(marker);
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        getBikes();
                    }
                };
                getParkingAreas();
            }
        } else {
            cities.forEach((city) => {
                const cityLong = parseFloat(city.location.longitude);
                const cityLat = parseFloat(city.location.latitude);

                const markerElement = document.createElement('div');
                markerElement.style.width = '40px';
                markerElement.style.height = '40px';
                markerElement.style.borderRadius = '50%';
                markerElement.style.overflow = 'hidden';
                markerElement.style.backgroundImage = `url(${logo})`;
                markerElement.style.backgroundSize = 'cover';
                markerElement.style.backgroundPosition = 'center';
                markerElement.style.border = '2px solid black';

                const marker = new mapboxgl.Marker({ element: markerElement }).setLngLat([cityLong, cityLat]).addTo(mapRef.current);
                citiesRef.current.push(marker);
            });
        }
        if (!overview) {
            new mapboxgl.Marker({ color: 'green' }).setLngLat([long, lat]).addTo(mapRef.current);

            mapRef.current.on('load', () => {
                const radiusInMeters = 50;
                const circle = createGeoJSONCircle([long, lat], radiusInMeters);

                mapRef.current.addSource('circle-source', {
                    type: 'geojson',
                    data: circle,
                });

                mapRef.current.addLayer({
                    id: 'circle-layer',
                    type: 'fill',
                    source: 'circle-source',
                    layout: {},
                    paint: {
                        'fill-color': '#0080ff',
                        'fill-opacity': 0.3,
                    },
                });

                mapRef.current.addLayer({
                    id: 'circle-outline',
                    type: 'line',
                    source: 'circle-source',
                    layout: {},
                    paint: {
                        'line-color': '#004080',
                        'line-width': 3,
                    },
                });
            });
        }

        if (!markersVisible && markersRef.current.length > 0 && bikesRef.current.length > 0) {
            markersRef.current.forEach((marker) => marker.remove());
            bikesRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
            bikesRef.current = [];
        }

        if (markersVisible && citiesRef.current.length > 0) {
            citiesRef.current.forEach((marker) => marker.remove());
            citiesRef.current = [];
        }
    }, [location, markersVisible]);

    useEffect(() => {
        if (startSim) {
            const interval = setInterval(async () => {
                if (markersVisible) {
                    const res = await axios.get('http://localhost:8000/api/simulation/update', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    //Bikes object, keys = bikeIds
                    const bikes = res.data.data;
                    const bikeIds = Object.keys(bikes);
                    bikeIds.forEach((bikeId) => {
                        const longitude = bikes[bikeId].location.longitude;
                        const latitude = bikes[bikeId].location.latitude;
                        const charge = bikes[bikeId].charge;
                        const available = bikes[bikeId].available;
                        const chargeColor = charge >= 70 ? 'green' : charge >= 50 ? '#FDCE06' : charge >= 30 ? '#EB841F' : '#D61E2A';

                        bikesRef.current.some((bike) => {
                            if (bikeId === bike._element.dataset.bikeId) {
                                const element = bike.getElement();
                                element.childNodes[0].style.backgroundColor = chargeColor;
                                element.style.display = 'block';
                                const popup = bike.getPopup();

                                popup.setHTML(
                                    `<div>
                                    <h3>${bikeId}</h3>
                                    <div class="popup-body">
                                        <p><strong>Postion:</strong> ${latitude}, ${longitude}</p>
                                        <p><strong>Laddning:</strong> ${charge}%</p>
                                        <p><strong>Tillgänglig:</strong> ${available ? 'Ja' : 'Nej'}</p>
                                    </div>
                                </div>`
                                );
                                bike.setLngLat([longitude, latitude]);
                            }
                        });
                    });
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [markersVisible, startSim]);

    if (isTestEnvironment) {
        return null;
    }

    function createGeoJSONCircle(center, radius, numPoints = 64) {
        const toRad = (degree) => (degree * Math.PI) / 180;

        const earthRadius = 6371000;
        const angleStep = (2 * Math.PI) / numPoints;

        const coordinates = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const latitude = center[1] + (radius / earthRadius) * (180 / Math.PI) * Math.sin(angle);
            const longitude = center[0] + ((radius / earthRadius) * (180 / Math.PI) * Math.cos(angle)) / Math.cos(toRad(center[1]));
            coordinates.push([longitude, latitude]);
        }

        coordinates.push(coordinates[0]);

        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
            },
            properties: {},
        };
    }

    return <div className='map' ref={mapContainerRef}></div>;
}
