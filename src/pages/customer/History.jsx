import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';

export default function History({ userId }) {
    const [history, setHistory] = useState([]);
    const [githubUser] = useAuthState(auth);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/oauth/${githubUser.uid}`);
            setUser(res.data.user);
            console.log(res.data.user);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            const getHistory = async () => {
                /* const res = await axios.get(`http://localhosten:8000/api/rentals/userrentals/${user.id}`);
                setHistory(res.data.rentals); */

                console.log(123);
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
                        <div>Totaltid</div>
                        <div>Totalkostnad</div>
                        <div>Status</div>
                    </li>
                    <li className='customer-card'>
                        <p>123123123</p>
                        {/*  <p>{rental.createdAt}</p>
                        <p>{rental.updatedAt}</p> */}
                        <p>22 min</p>
                        <p>100kr</p>
                        <p>Aktiv/Avslutad</p>
                    </li>
                    <li className='customer-card'>
                        <p>123123123</p>
                        <p>23/4-24 07:27</p>
                        <p>23/4-24 07:59</p>
                        <p>22 min</p>
                        <p>100kr</p>
                        <p>Aktiv/Avslutad</p>
                    </li>
                    <li className='customer-card'>
                        <p>123123123</p>
                        <p>23/4-24 07:27</p>
                        <p>23/4-24 07:59</p>
                        <p>22 min</p>
                        <p>100kr</p>
                        <p>Aktiv/Avslutad</p>
                    </li>
                    <li className='customer-card'>
                        <p>123123123</p>
                        <p>23/4-24 07:27</p>
                        <p>23/4-24 07:59</p>
                        <p>22 min</p>
                        <p>100kr</p>
                        <p>Aktiv/Avslutad</p>
                    </li>
                </ul>
            </div>
        </>
    );
}
