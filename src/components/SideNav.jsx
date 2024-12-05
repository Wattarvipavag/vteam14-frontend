import { NavLink } from 'react-router-dom';
import {
    TbLayoutDashboard,
    TbMapPin,
    TbUsers,
    TbScooter,
    TbParking,
    TbChargingPile,
    TbUser,
    TbHistory,
    TbCreditCard,
} from 'react-icons/tb';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { useRole } from '../contexts/RoleContext';

export default function SideNav() {
    const [role, setRole] = useRole();
    return role === 'admin' ? <AdminNav /> : <CustomerNav />;
}

function AdminNav() {
    const [user] = useAuthState(auth);

    return (
        <div className='sidenav'>
            <div className='sidenav-header'>
                <h2>{user?.displayName}</h2>
                <img src={user?.photoURL} alt='profile-picture' />
            </div>
            <ul className='sidenav-links'>
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

function CustomerNav() {
    const [user] = useAuthState(auth);

    return (
        <div className='sidenav'>
            <div className='sidenav-header'>
                <h2>{user?.displayName}</h2>
                <img src={user?.photoURL} alt='profile-picture' />
            </div>
            <ul className='sidenav-links'>
                <li>
                    <NavLink to='/customer' end>
                        <TbUser className='icon' />
                        Profil
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/customer/history'>
                        <TbHistory className='icon' />
                        Resehistorik
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/customer/payments'>
                        <TbCreditCard className='icon' />
                        Betalningar
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
