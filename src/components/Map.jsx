import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map({ location }) {
    const mapRef = useRef();
    const mapContainerRef = useRef();

    useEffect(() => {
        const long = parseFloat(location.longitude);
        const lat = parseFloat(location.latitude);

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [long, lat],
            zoom: 15,
            pitch: 20,
            style: 'mapbox://styles/mapbox/standard',
            minZoom: 7,
            maxZoom: 20,
        });

        mapRef.current.on('style.load', () => {
            mapRef.current.setConfigProperty('basemap', 'lightPreset', 'dusk');
        });

        new mapboxgl.Marker({ color: 'blue' }).setLngLat([long, lat]).addTo(mapRef.current);

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
