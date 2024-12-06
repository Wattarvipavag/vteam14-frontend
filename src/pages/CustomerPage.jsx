import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';

export default function CustomerPage() {
    return (
        <div className='container'>
            <Header />
            <div className='dashboard'>
                <SideNav />
                <div className='customer'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
