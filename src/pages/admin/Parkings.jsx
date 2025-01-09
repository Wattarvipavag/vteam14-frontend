import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddButton from '../../components/AddButton';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';

export default function Parkings() {
    const [parkings, setParkings] = useState([]);
    const [search, setSearch] = useState('');
    const [cityNames, setCityNames] = useState({}); // Object to store city names keyed by cityId
    const { refresh } = useDataRefresh();
    const [user] = useAuthState(auth);
    const token = user.accessToken;

    const filteredParkings = parkings.filter((parking) => parking.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        async function fetchParkingsAndCities() {
            try {
                // Fetch parking areas
                const parkingsRes = await axios.get('http://localhost:8000/api/parkingareas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const parkingData = parkingsRes.data;
                setParkings(parkingData);

                // Extract unique city IDs from the parkings data
                const uniqueCityIds = [...new Set(parkingData.map((parking) => parking.cityId))];

                // Fetch all city names for the unique city IDs
                const cityNameMap = {};
                await Promise.all(
                    uniqueCityIds.map(async (id) => {
                        const cityRes = await axios.get(`http://localhost:8000/api/cities/cityid/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        cityNameMap[id] = cityRes.data.city.name; // Map city ID to city name
                    })
                );

                setCityNames(cityNameMap); // Store city names in state
            } catch (error) {
                console.error('Error fetching parking areas or city names:', error);
            }
        }

        fetchParkingsAndCities();
    }, [refresh]); // Empty dependency array to run only once when the component mounts

    return (
        <>
            <div className='title-and-button'>
                <h2>Parkeringszoner</h2>
                <AddButton text='Lägg till parkeringszon' />
            </div>
            <div className='admin-parkings'>
                {parkings.length > 0 && (
                    <>
                        <input
                            type='text'
                            placeholder='Sök efter parkeringszon...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <ul>
                            <li className='parking-header'>
                                <div>Namn</div>
                                <div>Antal Elsparkcyklar</div>
                                <div>Stad</div>
                            </li>

                            {filteredParkings.map((parking) => (
                                <li className='parking-card' key={parking._id}>
                                    <Link to={`/admin/parkingareas/${parking._id}`}>
                                        <p>{parking.name}</p>
                                        <p>{parking.bikes.length}</p>
                                        {/* Fetch and display the city name using the cityId */}
                                        <p>{cityNames[parking.cityId] || 'Laddar...'}</p>
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
