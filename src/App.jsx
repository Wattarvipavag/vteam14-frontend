import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRole } from './contexts/RoleContext';
import Spinner from './components/Spinner';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import CustomerPage from './pages/CustomerPage';
import Overview from './pages/admin/Overview';
import Cities from './pages/admin/Cities';
import Users from './pages/admin/Users';
import Scooters from './pages/admin/Scooters';
import Parkings from './pages/admin/Parkings';
import Chargings from './pages/admin/Chargings';
import User from './pages/admin/User';
import Profile from './pages/customer/Profile';
import History from './pages/customer/History';
import Payments from './pages/customer/Payments';

export default function App() {
    const { role, isLoadingRole } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoadingRole && role) {
            navigate(`/${role}`);
        } else if (!isLoadingRole && !role) {
            navigate('/');
        }
    }, [role, isLoadingRole]);

    if (isLoadingRole) {
        return <Spinner />;
    }

    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            {role === 'admin' && (
                <Route path='/admin' element={<AdminPage />}>
                    <Route index element={<Overview />} />
                    <Route path='cities' element={<Cities />} />
                    <Route path='users' element={<Users />} />
                    <Route path='users/:id' element={<User />} />
                    <Route path='scooters' element={<Scooters />} />
                    <Route path='parkings' element={<Parkings />} />
                    <Route path='chargings' element={<Chargings />} />
                </Route>
            )}
            {role === 'customer' && (
                <Route path='/customer' element={<CustomerPage />}>
                    <Route index element={<Profile />} />
                    <Route path='history' element={<History />} />
                    <Route path='payments' element={<Payments />} />
                </Route>
            )}
        </Routes>
    );
}
