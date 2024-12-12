import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

export default function City() {
    const [city, setCity] = useState({});
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getCity() {
            const res = await axios.get(`http://localhost:8000/api/cities/cityid/${id}`);
            setCity(res.data.city);
        }
        getCity();
    }, []);

    return (
        <>
            <h2>{city.name}</h2>
            <div className='admin-city'>
                <button onClick={() => navigate('/admin/cities')}>
                    <TbArrowBackUp />
                    Tillbaka Till Städer
                </button>
                <p>Här kommer info om staden!</p>
            </div>
        </>
    );
}
