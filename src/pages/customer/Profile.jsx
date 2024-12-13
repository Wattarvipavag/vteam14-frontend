import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig.js';

export default function Profile() {
    const [user, setUser] = useState();
    const [githubUser] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [money, setMoney] = useState(0);

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/oauth/${githubUser.uid}`);
            setUser(res.data.user);
        };
        getUser();
    }, []);

    const handleAddEmail = async () => {
        await axios.post(`http://localhost:8000/api/users/${user._id}`, {
            email,
        });
        setUser((prevUser) => ({ ...prevUser, email }));
    };

    const handleAddMoney = async () => {
        const balance = parseInt(user.balance) + parseInt(money);
        await axios.post(`http://localhost:8000/api/users/${user._id}`, {
            balance,
        });

        setUser((prevUser) => ({ ...prevUser, balance }));
        setMoney(0);
    };

    return (
        <>
            <h2 className='profile-heading'>Profil</h2>
            {user && (
                <div className='customer-profile'>
                    {user.email === 'Finns ej' && (
                        <>
                            <div className='no-email'>Det verkar som att vi saknar din e-postadress. Vänligen ange den i fältet nedan.</div>
                            <div className='update-email'>
                                <input type='email' placeholder='Ange email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                <div onClick={handleAddEmail} className='update-email-btn'>
                                    Uppdatera
                                </div>
                            </div>
                        </>
                    )}
                    <div className='customer-profile-cards'>
                        <Card title='Namn' value={user.name} backgroundColor='#d6f7e8' />
                        <Card title='Email' value={user.email === 'Finns ej' ? 'Finns ej...' : user.email} backgroundColor='#b3d9ff' />
                        <Card title='Saldo' value={`${user.balance} SEK`} backgroundColor='#fff7d6' />
                    </div>
                    <div className='add-money'>
                        <h3>Fyll på saldo</h3>
                        <input type='number' min={0} placeholder='Ange summa' value={money} onChange={(e) => setMoney(e.target.value)} />
                        <button onClick={handleAddMoney}>Lägg till pengar</button>
                    </div>
                </div>
            )}
        </>
    );
}

function Card({ title, value, backgroundColor }) {
    return value === null ? (
        ''
    ) : (
        <div className='card' style={{ backgroundColor }}>
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
}
