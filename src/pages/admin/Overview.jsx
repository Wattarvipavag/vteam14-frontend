import { TbMapPin, TbUsers, TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';

export default function Overview() {
    const citiesCount = 12;
    const usersCount = 100;
    const scootersCount = 50;
    const parkingsCount = 14;
    const chargingsCount = 4;

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
    return (
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
