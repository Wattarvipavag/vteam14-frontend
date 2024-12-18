import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';
import Map from '../../components/Map';
import axios from 'axios';

export default function Scooter() {
    const [scooter, setScooter] = useState(null);
    const [city, setCity] = useState(null);
    const [parking, setParking] = useState(null);
    const [charging, setCharging] = useState(null);
    const [parkingAreasName, setParkingAreasName] = useState([]);
    const [parkingAreasId, setParkingAreasId] = useState([]);
    const [chargingStationsName, setChargingStationsName] = useState([]);
    const [chargingStationsId, setChargingStationsId] = useState([]);
    const [selectedParkingArea, setSelectedParkingArea] = useState('');
    const [selectedChargingStation, setSelectedChargingStation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function getScooter() {
            const res = await axios.get(`http://localhost:8000/api/bikes/${id}`);
            setScooter(res.data.bike);
        }
        getScooter();
    }, []);

    useEffect(() => {
        if (!scooter) return;

        const getCity = async () => {
            const res = await axios.get(`http://localhost:8000/api/cities/cityid/${scooter.cityId}`);
            setCity(res.data.city);
        };
        getCity();

        if (scooter.parkingAreaId) {
            const getParking = async () => {
                const res = await axios.get(`http://localhost:8000/api/parkingareas/${scooter.parkingAreaId}`);
                setParking(res.data.parkingArea);
            };
            getParking();
        }

        if (scooter.chargingStationId) {
            const getCharging = async () => {
                const res = await axios.get(`http://localhost:8000/api/chargingstations/${scooter.chargingStationId}`);
                setCharging(res.data.chargingStation);
            };
            getCharging();
        }
    }, [scooter]);

    useEffect(() => {
        if (!city) return;

        const getParkingAreasInCity = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/cities/cityid/${scooter.cityId}`);
                const parkingAreasInCity = res.data.city.parkingAreas;

                const parkingResponses = await Promise.all(
                    parkingAreasInCity.map((area) => axios.get(`http://localhost:8000/api/parkingareas/${area}`))
                );

                const names = parkingResponses.map((res) => res.data.parkingArea.name);
                const ids = parkingResponses.map((res) => res.data.parkingArea._id);

                setParkingAreasName(names);
                setParkingAreasId(ids);
            } catch (error) {
                console.error('Error fetching parking areas:', error);
            }
        };

        setParkingAreasName([]);
        setParkingAreasId([]);

        getParkingAreasInCity();
    }, [city]);

    useEffect(() => {
        if (!city) return;

        const getChargingstationsInCity = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/cities/cityid/${scooter.cityId}`);
                const chargingStationsInCity = res.data.city.chargingStations;

                const chargingResponses = await Promise.all(
                    chargingStationsInCity.map((charging) => axios.get(`http://localhost:8000/api/chargingstations/${charging}`))
                );

                const names = chargingResponses.map((res) => res.data.chargingStation.name);
                const ids = chargingResponses.map((res) => res.data.chargingStation._id);

                setChargingStationsName(names);
                setChargingStationsId(ids);
            } catch (error) {
                console.error('Error fetching charging stations:', error);
            }
        };

        setChargingStationsName([]);
        setChargingStationsId([]);

        getChargingstationsInCity();
    }, [city]);

    const handleChangeParking = async () => {
        setError('');
        if (!selectedParkingArea) {
            setError('Välj en parkeringsplats.');
            return;
        }

        try {
            setLoading(true);

            if (scooter.parkingAreaId) {
                await axios.put(`http://localhost:8000/api/parkingareas/deletebike/${scooter.parkingAreaId}`, {
                    bikeId: scooter._id,
                });
            } else if (scooter.chargingStationId) {
                await axios.put(`http://localhost:8000/api/chargingstations/deletebike/${scooter.chargingStationId}`, {
                    bikeId: scooter._id,
                });
            }

            const newParking = await axios.post(`http://localhost:8000/api/parkingareas/addbike/${selectedParkingArea}`, {
                bikeId: scooter._id,
            });

            const bike = await axios.put(`http://localhost:8000/api/bikes/${scooter._id}`, {
                location: newParking.data.parkingArea.location,
            });

            setScooter((prevScooter) => ({
                ...prevScooter,
                location: newParking.data.parkingArea.location,
                parkingAreaId: selectedParkingArea,
                chargingStationId: null,
            }));

            setLoading(false);
            setSelectedParkingArea('');
        } catch (error) {
            setLoading(false);
            setError('Något gick fel. Försök igen.');
        }
    };

    const handleChangeCharging = async () => {
        setError('');
        if (!selectedChargingStation) {
            setError('Välj en laddstation.');
            return;
        }

        try {
            setLoading(true);

            if (scooter.chargingStationId) {
                await axios.put(`http://localhost:8000/api/chargingstations/deletebike/${scooter.chargingStationId}`, {
                    bikeId: scooter._id,
                });
            } else if (scooter.parkingAreaId) {
                await axios.put(`http://localhost:8000/api/parkingareas/deletebike/${scooter.parkingAreaId}`, {
                    bikeId: scooter._id,
                });
            }

            const newCharging = await axios.post(`http://localhost:8000/api/chargingstations/addbike/${selectedChargingStation}`, {
                bikeId: scooter._id,
            });

            const bike = await axios.put(`http://localhost:8000/api/bikes/${scooter._id}`, {
                location: newCharging.data.chargingStation.location,
            });

            setScooter((prevScooter) => ({
                ...prevScooter,
                location: newCharging.data.chargingStation.location,
                chargingStationId: selectedChargingStation,
                parkingAreaId: null,
            }));

            setLoading(false);
            setSelectedChargingStation('');
        } catch (error) {
            setLoading(false);
            setError('Något gick fel. Försök igen.');
        }
    };

    return (
        scooter && (
            <div className='admin-scooter'>
                <div className='title-and-back'>
                    <button className='back-button' onClick={() => navigate('/admin/bikes')}>
                        <TbArrowBackUp size={20} />
                        Tillbaka Till Elsparkcyklar
                    </button>
                    <h2>{scooter._id}</h2>
                </div>
                <div className='map-and-info'>
                    <div className='map-container'>
                        <Map location={scooter.location} zoom={15} minZoom={12} maxZoom={20} overview={false} />
                    </div>
                    <div className='info-container'>
                        <h3>Information</h3>
                        {city && (
                            <p>
                                <strong>Stad:</strong> {city.name}
                            </p>
                        )}
                        <p>
                            <strong>Batterinivå:</strong> {scooter.charge}%
                        </p>
                        <p>
                            <strong>Senast registrerad hastighet:</strong> {scooter.speed} km/h
                        </p>
                        <p>
                            <strong>Tillgänglig:</strong> {scooter.available ? 'Ja' : 'Nej'}
                        </p>

                        {scooter.parkingAreaId && (
                            <p>
                                <strong>Nuvarande parkeringsplats:</strong> {parking?.name}
                            </p>
                        )}

                        {scooter.chargingStationId && (
                            <p>
                                <strong>Nuvarande laddstation:</strong> {charging?.name}
                            </p>
                        )}
                        {scooter.available && (
                            <>
                                {parkingAreasName.length > 0 && (
                                    <div className='scooter-update'>
                                        <select value={selectedParkingArea} onChange={(e) => setSelectedParkingArea(e.target.value)}>
                                            <option>Välj parkeringsplats</option>
                                            {parkingAreasName.map((area, id) => (
                                                <option value={parkingAreasId[id]} key={id}>
                                                    {area}
                                                </option>
                                            ))}
                                        </select>
                                        <button disabled={loading} onClick={handleChangeParking} className='add-form-button'>
                                            {loading ? 'Laddar...' : 'Flytta till parkeringsplats'}
                                        </button>
                                    </div>
                                )}

                                {chargingStationsName.length > 0 && <div className='divider'></div>}

                                {chargingStationsName.length > 0 && (
                                    <div className='scooter-update'>
                                        <select
                                            value={selectedChargingStation}
                                            onChange={(e) => setSelectedChargingStation(e.target.value)}>
                                            <option>Välj laddstation</option>
                                            {chargingStationsName.map((area, id) => (
                                                <option value={chargingStationsId[id]} key={id}>
                                                    {area}
                                                </option>
                                            ))}
                                        </select>
                                        <button disabled={loading} onClick={handleChangeCharging} className='add-form-button'>
                                            {loading ? 'Laddar...' : 'Flytta till laddstation'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        {error && <p className='error-message'>{error}</p>}
                    </div>
                </div>
            </div>
        )
    );
}
