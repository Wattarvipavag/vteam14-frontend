import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';
import Map from '../../components/Map';

export default function Parking() {
    const [parking, setParking] = useState(null);
    const [city, setCity] = useState(null);
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getParking() {
            const res = await axios.get(`http://localhost:8000/api/parkingareas/${id}`);
            setParking(res.data.parkingArea);
        }
        getParking();
    }, []);

    useEffect(() => {
        if (parking) {
            const getCity = async () => {
                const res = await axios.get(`http://localhost:8000/api/cities/cityid/${parking.cityId}`);
                setCity(res.data.city.name);
            };
            getCity();
        }
    }, [parking]);

    return (
        parking && (
            <div className='admin-parking'>
                <div className='title-and-back'>
                    <button className='back-button' onClick={() => navigate('/admin/parkingareas')}>
                        <TbArrowBackUp size={20} />
                        Tillbaka Till Parkeringszoner
                    </button>
                    <h2>{parking.name}</h2>
                </div>
                <div className='map-and-info'>
                    <div className='map-container'>
                        <Map location={parking.location} zoom={15} overview={false} />
                    </div>
                    <div className='info-container'>
                        <h3>Information</h3>
                        <p>
                            <strong>Stad:</strong> {city}
                        </p>
                        <p>
                            <strong>Antal Elsparkcyklar:</strong> {parking.bikes.length}
                        </p>
                        {parking.bikes.length > 0 && (
                            <div className='bikes-section'>
                                <h3>Elsparkcyklar i denna zon:</h3>
                                <div className='bikes-flex'>
                                    {parking.bikes.map((bikeId) => (
                                        <div key={bikeId} className='bike-card'>
                                            <p>
                                                <strong>Bike ID:</strong> {bikeId}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
}
