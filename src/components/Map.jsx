import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';

export default function Map({ location, zoom, overview }) {
    const mapRef = useRef();
    const mapContainerRef = useRef();

    useEffect(() => {
        const long = parseFloat(location.longitude);
        const lat = parseFloat(location.latitude);

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [long, lat],
            zoom: zoom,
            pitch: 20,
            style: 'mapbox://styles/mapbox/standard',
        });

        mapRef.current.on('style.load', () => {
            mapRef.current.setConfigProperty('basemap', 'lightPreset', 'dusk');
        });

        if (overview) {
            const getBikes = async () => {
                const res = await axios.get('http://localhost:8000/api/bikes');
                const chargingStations = await axios.get('http://localhost:8000/api/chargingstations');
                const parkingAreas = await axios.get('http://localhost:8000/api/parkingareas');

                let chargingCounter = {};
                chargingStations.data.forEach((chargingstation) => {
                    chargingCounter[chargingstation._id] = 0;
                });

                let parkingCounter = {};
                parkingAreas.data.forEach((parkingarea) => {
                    parkingCounter[parkingarea._id] = 0;
                });

                res.data.forEach((bike, id) => {
                    const markerElement = document.createElement('div');
                    let chargeColor =
                        bike.charge >= 70 ? 'green' : bike.charge >= 50 ? '#FDCE06' : bike.charge >= 30 ? '#EB841F' : '#D61E2A';

                    const popup = new mapboxgl.Popup({
                        closeOnMove: true,
                    }).setHTML(
                        `<div>
                            <h3>${bike._id}</h3>
                            <div class="popup-body">
                                <p><strong>Postion:</strong> ${bike.location.latitude}, ${bike.location.longitude}</p>
                                <p><strong>Laddning:</strong> ${bike.charge}%</p>
                                <p><strong>Tillgänglig:</strong> ${bike.available ? 'Ja' : 'Nej'}</p>
                            </div>
                        </div>`
                    );

                    // Render the React icon into the container
                    const root = ReactDOM.createRoot(markerElement);

                    if (bike.chargingStationId && chargingCounter[bike.chargingStationId] <= 4) {
                        let offset = chargingCounter[bike.chargingStationId];
                        chargingCounter[bike.chargingStationId] += 1;
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
                        new mapboxgl.Marker({
                            element: markerElement,
                        })
                            .setLngLat([bike.location.longitude, bike.location.latitude])
                            .addTo(mapRef.current)
                            .setPopup(popup);
                    }
                    if (bike.parkingAreaId && parkingCounter[bike.parkingAreaId] <= 4) {
                        let offset = parkingCounter[bike.parkingAreaId];
                        console.log(offset);

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
                        new mapboxgl.Marker({
                            element: markerElement,
                        })
                            .setLngLat([bike.location.longitude, bike.location.latitude])
                            .addTo(mapRef.current)
                            .setPopup(popup);

                        parkingCounter[bike.parkingAreaId] += 1;
                    }

                    if (!bike.parkingAreaId && !bike.chargingStationId) {
                        root.render(
                            <TbScooter
                                style={{
                                    backgroundColor: chargeColor,
                                }}
                                size={30}
                                color='black'
                                className='scooter-icon'
                            />
                        );

                        // Add the marker to the map
                        new mapboxgl.Marker({
                            element: markerElement,
                        })
                            .setLngLat([bike.location.longitude, bike.location.latitude])
                            .addTo(mapRef.current)
                            .setPopup(popup);
                    }
                });
            };

            const getParkingAreas = async () => {
                try {
                    const res = await axios.get('http://localhost:8000/api/parkingareas');

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

                        // Create a container div
                        const markerElement = document.createElement('div');

                        // Render the React icon into the container
                        const root = ReactDOM.createRoot(markerElement);
                        root.render(<TbParking className='parking-icon' size={50} color='white' fill='#0271c0' />);

                        // Add the marker to the map
                        new mapboxgl.Marker({ element: markerElement })
                            .setLngLat([parkingArea.location.longitude, parkingArea.location.latitude])
                            .addTo(mapRef.current)
                            .setPopup(popup);
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    getChargingStations();
                }
            };

            const getChargingStations = async () => {
                try {
                    const res = await axios.get('http://localhost:8000/api/chargingstations');

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

                        // Create a container div
                        const markerElement = document.createElement('div');

                        // Render the React icon into the container
                        const root = ReactDOM.createRoot(markerElement);
                        root.render(<TbChargingPile className='charging-icon' size={50} fill='#41ab5d' />);

                        // Add the marker to the map
                        new mapboxgl.Marker({ element: markerElement })
                            .setLngLat([chargingStation.location.longitude, chargingStation.location.latitude])
                            .addTo(mapRef.current)
                            .setPopup(popup);
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    getBikes();
                }
            };
            getParkingAreas();
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
    }, []);

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
