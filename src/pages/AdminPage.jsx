import { NavLink, Outlet } from 'react-router-dom';
import { TbLayoutDashboard, TbMapPin, TbUsers, TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';
import Header from '../components/Header';

export default function AdminPage() {
    return (
        <div className='admin-page'>
            <Header />
            <div className='admin-container'>
                <AdminNav />
                <div className='admin-dashboard'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

function AdminNav() {
    return (
        <div className='admin-nav'>
            <div className='admin-nav-header'>
                <h2>Admin</h2>
            </div>
            <ul className='admin-nav-links'>
                <li>
                    <NavLink to='/admin' end>
                        <TbLayoutDashboard className='icon' />
                        Översikt
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/cities'>
                        <TbMapPin className='icon' />
                        Städer
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/users'>
                        <TbUsers className='icon' />
                        Användare
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/scooters'>
                        <TbScooter className='icon' />
                        Elsparkcyklar
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/parkings'>
                        <TbParking className='icon' />
                        Parkeringszoner
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/chargings'>
                        <TbChargingPile className='icon' />
                        Laddstationer
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
