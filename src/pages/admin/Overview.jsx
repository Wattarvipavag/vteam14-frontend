import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMapPin, TbUsers, TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';

export default function Overview() {
    const [citiesCount, setCitiesCount] = useState(null);
    const [usersCount, setUsersCount] = useState(null);
    const [scootersCount, setScootersCount] = useState(null);
    const [parkingsCount, setParkingsCount] = useState(null);
    const [chargingsCount, setChargingsCount] = useState(null);

    useEffect(() => {
        const getCounters = async () => {
            const stats = await axios.get('http://localhost:8000/api/stats');

            setCitiesCount(stats.data.cities);
            setUsersCount(stats.data.users);
            setScootersCount(stats.data.bikes);
            setParkingsCount(stats.data.parkingAreas);
            setChargingsCount(stats.data.chargingstations);
        };

        getCounters();
    }, []);

    return (
        <>
            <h2>Översikt</h2>
            <div className='admin-overview'>
                <Card title='Städer' value={citiesCount} icon={<TbMapPin />} backgroundColor='#d6f7e8' />
                <Card title='Användare' value={usersCount} icon={<TbUsers />} backgroundColor='#b3d9ff' />
                <Card title='Elsparkcyklar' value={scootersCount} icon={<TbScooter />} backgroundColor='#fff7d6' />
                <Card title='Parkeringszoner' value={parkingsCount} icon={<TbParking />} backgroundColor='#f0e6a3' />
                <Card title='Laddstationer' value={chargingsCount} icon={<TbChargingPile />} backgroundColor='#ffcccb' />
            </div>
        </>
    );
}

function Card({ title, value, icon, backgroundColor }) {
    return value === null ? (
        ''
    ) : (
        <div className='card' style={{ backgroundColor }}>
            <div className='card-header'>
                {icon && <div>{icon}</div>}
                <h3>{title}</h3>
            </div>
            <div className='card-body'>
                <p>{value}</p>
            </div>
        </div>
    );
}
