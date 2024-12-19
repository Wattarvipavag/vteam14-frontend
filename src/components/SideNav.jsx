import { NavLink } from 'react-router-dom';
import { TbLayoutDashboard, TbMapPin, TbUsers, TbScooter, TbParking, TbChargingPile, TbUser, TbHistory } from 'react-icons/tb';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { useRole } from '../contexts/RoleContext';
import axios from 'axios';

export default function SideNav() {
    const { role } = useRole();
    return role === 'admin' ? <AdminNav /> : <CustomerNav />;
}

const handleDeleteAll = async () => {
    await axios.delete('http://localhost:8000/api/bikes');
    await axios.delete('http://localhost:8000/api/chargingstations');
    await axios.delete('http://localhost:8000/api/parkingareas');
    await axios.delete('http://localhost:8000/api/cities');
};

const handleDeleteAndReset = async () => {
    await axios.delete('http://localhost:8000/api/reset');
    await axios.post('http://localhost:8000/api/reset');
};

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
                    <NavLink to='/admin/bikes'>
                        <TbScooter className='icon' />
                        Elsparkcyklar
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/parkingareas'>
                        <TbParking className='icon' />
                        Parkeringszoner
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/admin/chargingstations'>
                        <TbChargingPile className='icon' />
                        Laddstationer
                    </NavLink>
                </li>
            </ul>
            <button onClick={handleDeleteAll}>Ta bort ALLT</button>
            <button onClick={handleDeleteAndReset} className='reset-button'>
                Ta bort och bygg upp
            </button>
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
                        Historik
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
