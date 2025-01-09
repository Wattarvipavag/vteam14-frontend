import { useEffect, useState } from 'react';
import axios from 'axios';
import AddButton from '../../components/AddButton';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';

export default function Cities() {
    const [cities, setCities] = useState([]);
    const [search, setSearch] = useState('');
    const { refresh } = useDataRefresh();
    const [user] = useAuthState(auth);
    const token = user.accessToken;

    const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        async function getCities() {
            const res = await axios.get('http://localhost:8000/api/cities', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCities(res.data);
        }
        getCities();
    }, [refresh]);

    return (
        <>
            <div className='title-and-button'>
                <h2>Städer</h2>
                <AddButton text='Lägg till stad' />
            </div>
            <div className='admin-cities'>
                {cities.length > 0 && (
                    <>
                        <input type='text' placeholder='Sök efter stad...' onChange={(e) => setSearch(e.target.value)} value={search} />
                        <ul>
                            <li className='city-header'>
                                <div>Namn</div>
                                <div>Antal Elsparkcyklar</div>
                                <div>Antal Parkeringszoner</div>
                                <div>Antal Laddstationer</div>
                                <div>Pris/min</div>
                                <div>Tilläggsavgift %</div>
                                <div>Rabatt %</div>
                            </li>

                            {filteredCities.map((city) => (
                                <li className='city-card' key={city._id}>
                                    <p>{city.name}</p>
                                    <p>{city.bikes.length}</p>
                                    <p>{city.parkingAreas.length}</p>
                                    <p>{city.chargingStations.length}</p>
                                    <p>{city.minuteRate}kr</p>
                                    <p>{city.surcharge}%</p>
                                    <p>{city.discount}%</p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}
