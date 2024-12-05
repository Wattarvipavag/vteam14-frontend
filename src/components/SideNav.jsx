import { NavLink } from 'react-router-dom';
import { TbLayoutDashboard, TbMapPin, TbUsers, TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';

export default function SideNav() {
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
