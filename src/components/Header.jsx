import logo from '../images/logo.png';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className='header'>
            <div className='header-content'>
                <img src={logo} alt='Logo' className='header-logo' />
                <h1 className='header-title'>Watt är vi på väg?</h1>
            </div>
            <nav>
                <Link to='/'>Home</Link>
                <Link to='/admin-dashboard'>Admin</Link>
                <Link to='/user-dashboard'>User</Link>
                <Link to='/login'>Login</Link>
            </nav>
        </header>
    );
}
