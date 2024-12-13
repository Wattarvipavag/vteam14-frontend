import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';
import AddToDbForm from '../components/AddToDbForm';
import { useShowForm } from '../contexts/ShowFormContext';

export default function AdminPage() {
    const { showForm, setShowForm } = useShowForm();
    return (
        <div className='container'>
            <Header />
            <div className='dashboard'>
                <SideNav />
                <div className='admin'>
                    {showForm && <AddToDbForm setShowForm={setShowForm} />}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
