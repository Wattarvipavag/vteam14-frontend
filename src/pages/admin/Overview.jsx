import { TbMapPin, TbUsers, TbScooter } from 'react-icons/tb';

export default function Overview() {
    const citiesCount = 12;
    const usersCount = 100;
    const scootersCount = 50;
    const parkingsCount = 14;
    const chargingsCount = 4;

    return (
        <>
            <h2>Översikt</h2>
            <div className='admin-dashboard-overview-cards'>
                <Card title='Städer' value={citiesCount} icon={<TbMapPin />} backgroundColor='#d6f7e8' />
                <Card title='Användare' value={usersCount} icon={<TbUsers />} backgroundColor='#b3d9ff' />
                <Card title='Elsparkcyklar' value={scootersCount} icon={<TbScooter />} backgroundColor='#fff7d6' />
                <Card title='Parkeringszoner' value={parkingsCount} icon={<TbScooter />} backgroundColor='#f0e6a3' />
                <Card title='Laddstationer' value={chargingsCount} icon={<TbScooter />} backgroundColor='#ffcccb' />
            </div>
            <div className='activity-overview'>
                <h3>Senaste Aktivitet</h3>
                <p>Ingen aktivitet</p>
            </div>
            <div className='alerts'>
                <h3>Viktiga Meddelanden</h3>
                <p>Inga meddelanden</p>
            </div>
        </>
    );
}

function Card({ title, value, icon, backgroundColor }) {
    return (
        <div className='admin-dashboard-overview-card' style={{ backgroundColor }}>
            <div className='admin-dashboard-overview-card-header'>
                {icon && <div className='admin-dashboard-overview-card-icon'>{icon}</div>}
                <h3 className='admin-dashboard-overview-card-title'>{title}</h3>
            </div>
            <div className='admin-dashboard-overview-card-body'>
                <p className='admin-dashboard-overview-card-value'>{value}</p>
            </div>
        </div>
    );
}
