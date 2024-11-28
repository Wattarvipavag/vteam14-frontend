import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';

import Header from './components/Header';

import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div>
            <Header />
            <div className='container'>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/user-dashboard' element={<UserPage />} />
                    <Route path='/admin-dashboard' element={<AdminPage />} />
                    <Route path='/login' element={<LoginPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
