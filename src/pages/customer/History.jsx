import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';

export default function History() {
    const [history, setHistory] = useState([]);
    const [githubUser] = useAuthState(auth);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/oauth/${githubUser.uid}`);
            setUser(res.data.user);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            const getHistory = async () => {
                const res = await axios.get(`http://localhost:8000/api/rentals/userrentals/${user._id}`);
                setHistory(res.data.rentals);
            };
            getHistory();
        }
    }, [user]);

    return (
        <>
            <h2>Historik</h2>
            <div className='customer-history'>
                <ul>
                    <li className='customer-header'>
                        <div>Resa(ID)</div>
                        <div>Starttid</div>
                        <div>Sluttid</div>
                        <div>Totalkostnad</div>
                        <div>Status</div>
                    </li>
                    {history.map((rental) => (
                        <li className='customer-card' key={rental._id}>
                            <p>{rental._id}</p>
                            <p>{new Date(rental.createdAt).toLocaleString()}</p>
                            <p>{new Date(rental.updatedAt).toLocaleString()}</p>
                            <p>{rental.totalCost}kr</p>
                            <p>{rental.status ? 'Aktiv' : 'Avslutad'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
