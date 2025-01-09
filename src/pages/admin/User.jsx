import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';

export default function User() {
    const [user, setUser] = useState(null);
    const [rentals, setRentals] = useState(null);
    let { id } = useParams();
    const navigate = useNavigate();
    const [githubuser] = useAuthState(auth);
    const token = githubuser.accessToken;

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get(`http://localhost:8000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data.user);
            } catch (error) {
                console.log(error);
                navigate('/admin/users', { replace: true });
            }
        }
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            const getRentals = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/rentals/userrentals/${user._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setRentals(res.data.rentals);
                } catch (error) {
                    console.error(error);
                }
            };
            getRentals();
        }
    }, [user]);

    const handleDelete = async () => {
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        navigate('/admin/users', { replace: true });
    };

    return (
        user && (
            <div className='admin-user'>
                <div className='title-and-back'>
                    <button className='back-button' onClick={() => navigate('/admin/users')}>
                        <TbArrowBackUp size={20} />
                        Tillbaka Till Användare
                    </button>
                    <div className='name-and-image-container'>
                        <h2>{user.name}</h2>
                        <img src={user.profileImage} alt='profile-picture' />
                    </div>
                </div>
                <div className='info-container'>
                    <h3>Information</h3>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Roll:</strong> {user.role}
                    </p>
                    <p>
                        <strong>Saldo:</strong> {user.balance}kr
                    </p>
                    <h3>Historik</h3>
                    <div className='rental-history'>
                        {rentals &&
                            rentals.map((rental) => (
                                <div key={rental._id} className='rental-item'>
                                    <p>
                                        <strong>Id:</strong> {rental._id}
                                    </p>
                                    <p>
                                        <strong>Aktiv:</strong> {rental.active ? 'Ja' : 'Nej'}
                                    </p>
                                    <p>
                                        <strong>Kostnad:</strong> {rental.totalCost} kr
                                    </p>
                                    <p>
                                        <strong>Starttid:</strong> {new Date(rental.createdAt).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Sluttid:</strong> {new Date(rental.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                    </div>

                    {user.role !== 'admin' && (
                        <button className='delete-btn' onClick={handleDelete}>
                            Ta bort användare
                        </button>
                    )}
                </div>
            </div>
        )
    );
}
