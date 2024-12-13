import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddButton from '../../components/AddButton';

export default function Cities() {
    const [cities, setCities] = useState([]);
    const [search, setSearch] = useState('');

    const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        async function getCities() {
            const res = await axios.get('http://localhost:8000/api/cities');
            setCities(res.data);
        }
        getCities();
    }, []);

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
                            </li>

                            {filteredCities.map((city) => (
                                <li className='city-card' key={city._id}>
                                    <Link to={`/admin/cities/${city._id}`}>
                                        <p>{city.name}</p>
                                        <p>{city.bikes.length}</p>
                                        <p>{city.parkingAreas.length}</p>
                                        <p>{city.chargingStations.length}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}
