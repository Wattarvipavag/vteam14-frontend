import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import Scooter from './pages/admin/Scooter';
import Parking from './pages/admin/Parking';
import Charging from './pages/admin/Charging';
import { ShowFormContextProvider } from './contexts/ShowFormContext';
import { DataRefreshProvider } from './contexts/DataRefreshContext';

export default function App() {
    const { role, loading } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (role) navigate(`/${role}`);
    }, [role, loading]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <ShowFormContextProvider>
            <DataRefreshProvider>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    {role === 'admin' && (
                        <Route path='/admin' element={<AdminPage />}>
                            <Route index element={<Overview />} />
                            <Route path='cities' element={<Cities />} />
                            <Route path='users' element={<Users />} />
                            <Route path='users/:id' element={<User />} />
                            <Route path='bikes' element={<Scooters />} />
                            <Route path='bikes/:id' element={<Scooter />} />
                            <Route path='parkingareas' element={<Parkings />} />
                            <Route path='parkingareas/:id' element={<Parking />} />
                            <Route path='chargingstations' element={<Chargings />} />
                            <Route path='chargingstations/:id' element={<Charging />} />
                        </Route>
                    )}
                    {role === 'customer' && (
                        <Route path='/customer' element={<CustomerPage />}>
                            <Route index element={<Profile />} />
                            <Route path='history' element={<History />} />
                        </Route>
                    )}
                    <Route path='*' element={<Navigate to={role ? `/${role}` : '/'} replace />} />
                </Routes>
            </DataRefreshProvider>
        </ShowFormContextProvider>
    );
}
