import { useLocation, useNavigate } from 'react-router-dom';
import { useShowForm } from '../contexts/ShowFormContext';
import { TbX } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRole } from '../contexts/RoleContext';

export default function AddToDbForm() {
    const [user] = useAuthState(auth);
    const { setShowForm } = useShowForm();
    const location = useLocation();
    const route = location.pathname.split('/')[2];
    let formFields = getFieldsForRoute(route);
    const [cities, setCities] = useState([]);
    const [parkingAreasName, setParkingAreasName] = useState([]);
    const [parkingAreasId, setParkingAreasId] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedParkingArea, setSelectedParkingArea] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { triggerRefresh } = useDataRefresh();
    const navigate = useNavigate();
    const { setRole } = useRole();

    useEffect(() => {
        if (route === 'bikes' || route === 'parkingareas' || route === 'chargingstations') {
            const getCities = async () => {
                try {
                    const token = await user.getIdToken(true);

                    const res = await axios.get('http://localhost:8000/api/cities', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCities(res.data);
                } catch (error) {
                    console.log(error);
                    await signOut();
                    setRole(null);
                    navigate('/');
                }
            };
            getCities();
        }
    }, [route]);

    useEffect(() => {
        setParkingAreasName([]);
        setParkingAreasId([]);
        if (selectedCity && route === 'bikes') {
            const getParkingAreas = async () => {
                try {
                    const token = await user.getIdToken(true);
                    const res = await axios.get(`http://localhost:8000/api/cities//cityid/${selectedCity}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const parkingAreasInCity = res.data.city.parkingAreas;

                    parkingAreasInCity.map(async (area) => {
                        const res = await axios.get(`http://localhost:8000/api/parkingareas/${area}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setParkingAreasName((prevState) => [...prevState, res.data.parkingArea.name]);
                        setParkingAreasId((prevState) => [...prevState, res.data.parkingArea._id]);
                    });
                } catch (error) {
                    console.log(error);
                    await signOut();
                    setRole(null);
                    navigate('/');
                }
            };
            getParkingAreas();
        } else {
            setParkingAreasName([]);
        }
    }, [selectedCity]);

    function getFieldsForRoute(route) {
        const fieldsForRoutes = {
            cities: [
                { title: 'Lägg till stad' },
                { name: 'name', type: 'text', label: 'Namn', placeholder: 'Ange stadens namn' },
                { name: 'minuteRate', type: 'number', label: 'Pris/min', placeholder: 'Ange minutpris' },
                { name: 'surcharge', type: 'number', label: 'Tilläggsavgift', placeholder: 'Ange eventuellt tilläggsavgift' },
                { name: 'discount', type: 'number', label: 'Rabatt', placeholder: 'Ange eventuell rabatt' },
                { name: 'latitude', type: 'text', label: 'Latitud ex. 55.66', placeholder: 'Ange latitud' },
                { name: 'longitude', type: 'text', label: 'Longitud ex. 55.66', placeholder: 'Ange longitud' },
            ],
            bikes: [
                { title: 'Lägg till elsparkcykel' },
                {
                    name: 'available',
                    type: 'text',
                    label: 'Tillgänglig',
                    placeholder: 'Tillgänglig',

                    disabled: true,
                },
                { name: 'cityId', type: 'text', label: 'Stad', placeholder: 'Välj stad' },
                { name: 'parkingAreaId', type: 'text', label: 'Parkeringsområde', placeholder: 'Välj parkeringsområde' },
            ],
            chargingstations: [
                { title: 'Lägg till laddstation' },
                { name: 'name', type: 'text', label: 'Namn', placeholder: 'Ange laddstationens namn' },
                { name: 'cityId', type: 'text', label: 'Stad', placeholder: 'Välj stad' },
                { name: 'latitude', type: 'text', label: 'Latitud ex. 55.66', placeholder: 'Ange latitud' },
                { name: 'longitude', type: 'text', label: 'Longitud ex. 55.66', placeholder: 'Ange longitud' },
            ],
            parkingareas: [
                { title: 'Lägg till parkeringszon' },
                { name: 'name', type: 'text', label: 'Namn', placeholder: 'Ange parkeringszonens namn' },
                { name: 'cityId', type: 'text', label: 'Stad', placeholder: 'Välj stad' },
                { name: 'latitude', type: 'text', label: 'Latitud ex. 55.66', placeholder: 'Ange latitud' },
                { name: 'longitude', type: 'text', label: 'Longitud ex. 55.66', placeholder: 'Ange longitud' },
            ],
        };

        return fieldsForRoutes[route];
    }

    const closeForm = () => {
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        setError('');
        e.preventDefault();

        try {
            const token = await user.getIdToken(true);
            const formData = new FormData(e.target);
            const dataToSubmit = {};

            for (const [, value] of formData) {
                if (
                    (value === '' && route === 'cities') ||
                    (value === '' && route === 'chargingstations') ||
                    (value === '' && route === 'parkingareas')
                ) {
                    throw new Error();
                }

                if (value === '' && !selectedCity) {
                    throw new Error();
                }
            }

            for (const [key, value] of formData) {
                if (key === 'available') {
                    dataToSubmit[key] = true;
                } else if (key === 'longitude' || key === 'latitude') {
                    dataToSubmit.location = dataToSubmit.location || {};
                    dataToSubmit.location[key] = value;
                } else {
                    dataToSubmit[key] = value;
                }
            }

            await axios.post(`http://localhost:8000/api/${route}`, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowForm(false);
            triggerRefresh();
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                await signOut();
                setRole(null);
                navigate('/');
            }
            setError('Något gick fel. Försök igen...');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
            <form className='add-form' onSubmit={handleSubmit}>
                <div className='close-btn' onClick={closeForm}>
                    <TbX strokeWidth={2} />
                </div>
                {formFields.map((field, id) =>
                    field.title ? (
                        <h1 key={id}>{field.title}</h1>
                    ) : (
                        <div className='form-group' key={id}>
                            <label>{field.label}</label>
                            {field.name === 'cityId' ? (
                                <select name={field.name} value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                    <option value='' disabled>
                                        Välj en stad
                                    </option>
                                    {cities.map((city, id) => {
                                        return (
                                            <option key={id} value={city._id}>
                                                {city.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            ) : field.name === 'parkingAreaId' ? (
                                <select
                                    name={field.name}
                                    value={selectedParkingArea}
                                    onChange={(e) => setSelectedParkingArea(e.target.value)}>
                                    <option value='' disabled>
                                        Välj parkeringsområde
                                    </option>
                                    {parkingAreasName.map((area, id) => (
                                        <option value={parkingAreasId[id]} key={id}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    readOnly={field.disabled}
                                />
                            )}
                        </div>
                    )
                )}
                {error && <p className='error-message'>{error}</p>}

                <button type='submit' className='add-form-button' disabled={loading}>
                    {loading ? 'Laddar...' : 'Lägg till'}
                </button>
            </form>
        </div>
    );
}
