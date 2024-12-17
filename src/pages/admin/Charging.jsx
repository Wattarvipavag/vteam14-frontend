import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';
import Map from '../../components/Map';

export default function Charging() {
    const [charging, setCharging] = useState(null);
    const [city, setCity] = useState(null);
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getCharging() {
            const res = await axios.get(`http://localhost:8000/api/chargingstations/${id}`);
            setCharging(res.data.chargingStation);
        }
        getCharging();
    }, []);

    useEffect(() => {
        if (charging) {
            const getCity = async () => {
                const res = await axios.get(`http://localhost:8000/api/cities/cityid/${charging.cityId}`);
                setCity(res.data.city.name);
            };
            getCity();
        }
    }, [charging]);

    return (
        charging && (
            <div className='admin-charging'>
                <div className='title-and-back'>
                    <button className='back-button' onClick={() => navigate('/admin/chargingstations')}>
                        <TbArrowBackUp size={20} />
                        Tillbaka Till Laddstationer
                    </button>
                    <h2>{charging.name}</h2>
                </div>
                <div className='map-and-info'>
                    <div className='map-container'>
                        <Map location={charging.location} />
                    </div>
                    <div className='info-container'>
                        <h3>Information</h3>
                        <p>
                            <strong>Stad:</strong> {city}
                        </p>
                        <p>
                            <strong>Antal Elsparkcyklar:</strong> {charging.bikes.length}
                        </p>
                        {charging.bikes.length > 0 && (
                            <div className='bikes-section'>
                                <h3>Elsparkcyklar på denna laddplats:</h3>
                                <div className='bikes-flex'>
                                    {charging.bikes.map((bikeId) => (
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
