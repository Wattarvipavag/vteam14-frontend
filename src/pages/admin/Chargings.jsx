import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddButton from '../../components/AddButton';
import { useDataRefresh } from '../../contexts/DataRefreshContext';

export default function Chargings() {
    const [chargings, setChargings] = useState([]);
    const [search, setSearch] = useState('');
    const [cityNames, setCityNames] = useState({}); // Object to store city names keyed by cityId
    const { refresh } = useDataRefresh();

    const filteredChargings = chargings.filter((charging) => charging.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        async function fetchChargingsAndCities() {
            try {
                // Fetch charging stations
                const chargingsRes = await axios.get('http://localhost:8000/api/chargingstations');
                const chargingsData = chargingsRes.data;
                setChargings(chargingsData);

                // Extract unique city IDs from the chargingstation data
                const uniqueCityIds = [...new Set(chargingsData.map((charging) => charging.cityId))];

                // Fetch all city names for the unique city IDs
                const cityNameMap = {};
                await Promise.all(
                    uniqueCityIds.map(async (id) => {
                        const cityRes = await axios.get(`http://localhost:8000/api/cities/cityid/${id}`);
                        cityNameMap[id] = cityRes.data.city.name; // Map city ID to city name
                    })
                );

                setCityNames(cityNameMap); // Store city names in state
            } catch (error) {
                console.error('Error fetching parking areas or city names:', error);
            }
        }

        fetchChargingsAndCities();
    }, [refresh]);

    return (
        <>
            <div className='title-and-button'>
                <h2>Laddstationer</h2>
                <AddButton text='Lägg till laddstation' />
            </div>
            <div className='admin-chargings'>
                {chargings.length > 0 && (
                    <>
                        <input
                            type='text'
                            placeholder='Sök efter laddstation...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <ul>
                            <li className='charging-header'>
                                <div>Namn</div>
                                <div>Antal Elsparkcyklar</div>
                                <div>Stad</div>
                            </li>

                            {filteredChargings.map((charging) => (
                                <li className='charging-card' key={charging._id}>
                                    <Link to={`/admin/chargingstations/${charging._id}`}>
                                        <p>{charging.name}</p>
                                        <p>{charging.bikes.length}</p>
                                        {/* Fetch and display the city name using the cityId */}
                                        <p>{cityNames[charging.cityId] || 'Laddar...'}</p>
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
