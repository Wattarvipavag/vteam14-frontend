import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShowForm } from '../contexts/ShowFormContext';
import { TbX } from 'react-icons/tb';

export default function AddToDbForm({ text }) {
    const { setShowForm } = useShowForm();
    const location = useLocation();
    const route = location.pathname.split('/')[2];
    const [formFields, setFormFields] = useState(getFieldsForRoute(route));

    useEffect(() => {
        console.log(formFields);
    }, []);

    function getFieldsForRoute(route) {
        const fieldsForRoutes = {
            cities: [
                { name: 'name', type: 'text', label: 'Name', required: true },
                { name: 'hourlyRate', type: 'number', label: 'Hourly Rate' },
                { name: 'surcharge', type: 'number', label: 'Surcharge' },
                { name: 'discount', type: 'number', label: 'Discount' },
            ],
            bikes: [
                { name: 'available', type: 'boolean', label: 'Available', required: true },
                {
                    name: 'location',
                    type: 'object',
                    label: 'Location',
                    fields: [
                        { name: 'lat', type: 'text', label: 'Latitude' },
                        { name: 'long', type: 'text', label: 'Longitude' },
                    ],
                },
                { name: 'cityId', type: 'text', label: 'CityId' },
                { name: 'parkingAreaId', type: 'text', label: 'Parking ID' },
                { name: 'chargingStationId', type: 'text', label: 'Charging Station ID' },
                { name: 'charge', type: 'number', label: 'Charge' },
            ],
            chargingstations: [
                { name: 'name', type: 'text', label: 'Name', required: true },
                {
                    name: 'location',
                    type: 'object',
                    label: 'Location',
                    fields: [
                        { name: 'lat', type: 'text', label: 'Latitude' },
                        { name: 'long', type: 'text', label: 'Longitude' },
                        { name: 'radius', type: 'number', label: 'Radius' },
                    ],
                },
                { name: 'cityId', type: 'text', label: 'CityId' },
                { name: 'bikes', type: 'text', label: 'Bikes' },
            ],
            parkingareas: [
                { name: 'name', type: 'text', label: 'Name', required: true },
                {
                    name: 'location',
                    type: 'object',
                    label: 'Location',
                    fields: [
                        { name: 'lat', type: 'text', label: 'Latitude' },
                        { name: 'long', type: 'text', label: 'Longitude' },
                        { name: 'radius', type: 'number', label: 'Radius' },
                    ],
                },
                { name: 'cityId', type: 'text', label: 'CityId' },
                { name: 'bikes', type: 'text', label: 'Bikes' },
            ],
        };

        return fieldsForRoutes[route];
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dataToSubmit = {};
    };

    const closeForm = () => {
        setShowForm(false);
    };

    return (
        <div className='form-container'>
            <form className='add-form' /* onSubmit={handleSubmit} */>
                <div className='close-btn' onClick={closeForm}>
                    <TbX strokeWidth={2} />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' placeholder='test@test.com' required />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Lösenord</label>
                    <input type='password' id='password' name='password' placeholder='********' required />
                </div>
                <button type='submit' className='add-form-button'>
                    Lägg till
                </button>
            </form>
        </div>
    );
}
