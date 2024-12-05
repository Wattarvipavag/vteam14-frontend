import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Overview from './pages/admin/Overview';
import Cities from './pages/admin/Cities';
import Users from './pages/admin/Users';
import Scooters from './pages/admin/Scooters';
import Parkings from './pages/admin/Parkings';
import Chargings from './pages/admin/Chargings';
import User from './pages/admin/User';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebaseConfig';
import Spinner from './components/Spinner';

function App() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            if (user) {
                if (location.pathname === '/') {
                    navigate('/admin');
                } else {
                    navigate(location.pathname);
                }
            } else {
                navigate('/');
            }
        }
    }, [loading]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/admin' element={<AdminPage />}>
                    <Route index element={<Overview />} />
                    <Route path='cities' element={<Cities />} />
                    <Route path='users' element={<Users />} />
                    <Route path='users/:id' element={<User />} />
                    <Route path='scooters' element={<Scooters />} />
                    <Route path='parkings' element={<Parkings />} />
                    <Route path='chargings' element={<Chargings />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
