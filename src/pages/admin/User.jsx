import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

export default function User() {
    const [user, setUser] = useState({});
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getUser() {
            const res = await axios.get(`http://localhost:8000/api/users/${id}`);
            setUser(res.data.user);
        }
        getUser();
    }, []);

    return (
        <>
            <h2>{user.name}</h2>
            <div className='admin-user'>
                <button onClick={() => navigate('/admin/users')}>
                    <TbArrowBackUp />
                    Tillbaka Till Användare
                </button>
                <p>Här kommer info om användaren!</p>
            </div>
        </>
    );
}
