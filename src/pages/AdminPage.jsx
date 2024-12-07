import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';

export default function AdminPage() {
    return (
        <div className='container'>
            <Header />
            <div className='dashboard'>
                <SideNav />
                <div className='admin'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
