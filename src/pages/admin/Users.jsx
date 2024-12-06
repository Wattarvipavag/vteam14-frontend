import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Users() {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function getUsers() {
            const res = await axios.get('http://localhost:8000/api/users');
            setUsers(res.data);
            setLoading(false);
        }

        getUsers();
    }, []);
    return (
        <>
            <h2>Användare</h2>
            <div className='admin-users'>
                <input type='text' placeholder='Sök efter användare...' />
                <ul>
                    <li className='user-header'>
                        <div>Namn</div>
                        <div>Email</div>
                        <div>Roll</div>
                    </li>

                    {loading && <p>Loading...</p>}

                    {users &&
                        users.map((user) => (
                            <li className='user-card' key={user._id}>
                                <Link to={`/admin/users/${user._id}`}>
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                    <p>{user.role === 'admin' ? 'Administratör' : 'Användare'}</p>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
}
