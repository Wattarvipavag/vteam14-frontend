import { useNavigate } from 'react-router-dom';
import { PiSignOutBold } from 'react-icons/pi';
import logo from '../images/logo.png';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { useRole } from '../contexts/RoleContext';

export default function Header() {
    const [signOut] = useSignOut(auth);
    const { setRole } = useRole();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const success = await signOut();

        if (success) {
            setRole(null);
            navigate('/');
        }
    };

    return (
        <header className='header'>
            <div className='header-logo'>
                <img src={logo} alt='Logo' />
                <h1>Watt är vi på väg?</h1>
            </div>
            <button className='logout-button' onClick={handleLogout}>
                <PiSignOutBold />
                Logga ut
            </button>
        </header>
    );
}
