import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

import { Routes, Route } from 'react-router-dom';

import Overview from './pages/admin/Overview';
import Cities from './pages/admin/Cities';
import Users from './pages/admin/Users';
import Scooters from './pages/admin/Scooters';
import Parkings from './pages/admin/Parkings';
import Chargings from './pages/admin/Chargings';
import User from './pages/admin/User';

function App() {
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
