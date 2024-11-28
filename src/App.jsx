import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

import { Routes, Route } from 'react-router-dom';

import Overview from './pages/admin/Overview';
import Cities from './pages/admin/Cities';
import Users from './pages/admin/Users';
import Scooters from './pages/admin/Scooters';
import Parking from './pages/admin/Parking';
import Charging from './pages/admin/Charging';

function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/admin' element={<AdminPage />}>
                    <Route index element={<Overview />} />
                    <Route path='cities' element={<Cities />} />
                    <Route path='users' element={<Users />} />
                    <Route path='scooters' element={<Scooters />} />
                    <Route path='parking' element={<Parking />} />
                    <Route path='charging' element={<Charging />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
