import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

export default function Charging() {
    const [charging, setCharging] = useState({});
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getCharging() {
            const res = await axios.get(`http://localhost:8000/api/chargingstations/${id}`);
            setCharging(res.data.chargingStation);
        }
        getCharging();
    }, []);

    return (
        <>
            <h2>{charging.name}</h2>
            <div className='admin-charging'>
                <button onClick={() => navigate('/admin/chargings')}>
                    <TbArrowBackUp />
                    Tillbaka Till Laddstationer
                </button>
                <p>Här kommer info om laddstationen!</p>
            </div>
        </>
    );
}
