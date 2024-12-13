import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

export default function Parking() {
    const [parking, setParking] = useState({});
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getParking() {
            const res = await axios.get(`http://localhost:8000/api/parkingareas/${id}`);
            setParking(res.data.parkingArea);
        }
        getParking();
    }, []);

    return (
        <>
            <h2>{parking.name}</h2>
            <div className='admin-parking'>
                <button onClick={() => navigate('/admin/parkingareas')}>
                    <TbArrowBackUp />
                    Tillbaka Till Parkeringszoner
                </button>
                <p>Här kommer info om parkeringzonen!</p>
            </div>
        </>
    );
}
