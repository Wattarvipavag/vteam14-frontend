import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMapPin, TbUsers, TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';
import Map from '../../components/Map';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';

export default function Overview() {
    const [citiesCount, setCitiesCount] = useState(null);
    const [usersCount, setUsersCount] = useState(null);
    const [scootersCount, setScootersCount] = useState(null);
    const [parkingsCount, setParkingsCount] = useState(null);
    const [chargingsCount, setChargingsCount] = useState(null);
    const [user] = useAuthState(auth);
    const token = user.accessToken;

    useEffect(() => {
        const getCounters = async () => {
            const stats = await axios.get('http://localhost:8000/api/stats', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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
                <Card title='Städer' value={citiesCount} icon={<TbMapPin size={40} />} backgroundColor='#d6f7e8' />
                <Card title='Användare' value={usersCount} icon={<TbUsers size={40} />} backgroundColor='#b3d9ff' />
                <Card title='Elsparkcyklar' value={scootersCount} icon={<TbScooter size={40} />} backgroundColor='#fff7d6' />
                <Card title='Parkeringszoner' value={parkingsCount} icon={<TbParking size={40} />} backgroundColor='#f0e6a3' />
                <Card title='Laddstationer' value={chargingsCount} icon={<TbChargingPile size={40} />} backgroundColor='#ffcccb' />
            </div>
            <Map location={{ latitude: '59.341195', longitude: '18.041041' }} zoom={5} overview={true} />
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
