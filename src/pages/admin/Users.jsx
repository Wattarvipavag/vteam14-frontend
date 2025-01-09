import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';
import { useRole } from '../../contexts/RoleContext';

export default function Users() {
    const [user] = useAuthState(auth);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const { setRole } = useRole();
    const [signOut] = useSignOut(auth);
    const navigate = useNavigate();
    const token = user.accessToken;

    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await axios.get('http://localhost:8000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(res.data);
            } catch (error) {
                console.log(error);
                await signOut();
                setRole(null);
                navigate('/');
            }
        }
        getUsers();
    }, []);

    return (
        <>
            <div className='title-and-button'>
                <h2>Användare</h2>
            </div>
            <div className='admin-users'>
                {users.length > 0 && (
                    <>
                        <input
                            type='text'
                            placeholder='Sök efter användare...'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <ul>
                            <li className='user-header'>
                                <div>Namn</div>
                                <div>Email</div>
                                <div>Roll</div>
                                <div>Saldo</div>
                                <div>Historik</div>
                            </li>

                            {filteredUsers.map((user) => (
                                <li className='user-card' key={user._id}>
                                    <Link to={`/admin/users/${user._id}`}>
                                        <p>{user.name}</p>
                                        <p>{user.email}</p>
                                        <p>{user.role === 'admin' ? 'Administratör' : 'Användare'}</p>
                                        <p>{user.balance}kr</p>
                                        <p>{user.rentalHistory.length} resor</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}
