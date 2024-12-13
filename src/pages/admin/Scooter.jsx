import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

export default function Scooter() {
    const [scooter, setScooter] = useState({});
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getCity() {
            const res = await axios.get(`http://localhost:8000/api/bikes/${id}`);
            setScooter(res.data.bike);
        }
        getCity();
    }, []);

    return (
        <>
            <h2>{scooter._id}</h2>
            <div className='admin-scooter'>
                <button onClick={() => navigate('/admin/bikes')}>
                    <TbArrowBackUp />
                    Tillbaka Till Elsparkcyklar
                </button>
                <p>Här kommer info om elsparkcykeln!</p>
            </div>
        </>
    );
}
