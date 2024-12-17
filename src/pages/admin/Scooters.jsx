import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddButton from '../../components/AddButton';
import { useDataRefresh } from '../../contexts/DataRefreshContext';

export default function Scooters() {
    const [scooters, setScooters] = useState([]);
    const [search, setSearch] = useState('');
    const { refresh } = useDataRefresh();

    const filteredScooters = scooters.filter((scooter) => scooter._id.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        async function getScooters() {
            const res = await axios.get('http://localhost:8000/api/bikes');
            setScooters(res.data);
        }
        getScooters();
    }, [refresh]);

    const getBatteryClass = (charge) => {
        if (charge > 70) return 'green';
        if (charge > 50) return 'yellow';
        return 'red';
    };

    return (
        <>
            <div className='title-and-button'>
                <h2>Elsparkcyklar</h2>
                <AddButton text='Lägg till elsparkcykel' />
            </div>
            <div className='admin-scooters'>
                {scooters.length > 0 && (
                    <>
                        <input
                            type='text'
                            placeholder='Sök efter elsparkcykel...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />

                        <ul>
                            <li className='scooter-header'>
                                <div>ID</div>
                                <div>Status</div>
                                <div>Batterinivå</div>
                                <div>Hastighet</div>
                                <div>På laddstation</div>
                                <div>På parkeringsplats</div>
                            </li>

                            {filteredScooters.map((scooter) => (
                                <li className='scooter-card' key={scooter._id}>
                                    <Link to={`/admin/bikes/${scooter._id}`}>
                                        <p>{scooter._id}</p>
                                        <p>{scooter.available ? 'Tillgänglig' : 'Utlånad'}</p>
                                        <p className={`battery ${getBatteryClass(scooter.charge)}`}>{scooter.charge}%</p>
                                        <p>{scooter.speed}</p>
                                        <p>{scooter.chargingStationId ? 'Ja' : 'Nej'}</p>
                                        <p>{scooter.parkingAreaId ? 'Ja' : 'Nej'}</p>
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
