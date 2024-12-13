import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useShowForm } from '../contexts/ShowFormContext';
import { TbX } from 'react-icons/tb';

export default function AddToDbForm() {
    const { setShowForm } = useShowForm();
    const location = useLocation();
    const route = location.pathname.split('/')[2];
    let formFields = getFieldsForRoute(route);
    const [bikes, setBikes] = useState([]);

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

        formFields.forEach((field) => {
            if (field.type === 'object') {
                const nestedObject = {};
                field.fields.forEach((nestedField) => {
                    const value = formData.get(nestedField.name);
                    if (value) nestedObject[nestedField.name] = value;
                });
                dataToSubmit[field.name] = nestedObject;
            } else if (field.type === 'text' && field.name === 'bikes') {
                dataToSubmit[field.name] = bikes;
            } else {
                const value = formData.get(field.name);
                if (value) dataToSubmit[field.name] = field.type === 'number' ? Number(value) : value;
            }
        });
    };

    const closeForm = () => {
        setShowForm(false);
    };

    const handleAddBike = () => {
        setBikes([...bikes, '']);
    };

    const handleRemoveBike = (index) => {
        setBikes(bikes.filter((_, i) => i !== index));
    };

    const handleBikeChange = (index, value) => {
        const updatedBikes = [...bikes];
        updatedBikes[index] = value;
        setBikes(updatedBikes);
    };

    return (
        <div className='form-container'>
            <form className='add-form' onSubmit={handleSubmit}>
                <div className='close-btn' onClick={closeForm}>
                    <TbX strokeWidth={2} />
                </div>
                {formFields.map((field) => (
                    <div className='form-group' key={field.name}>
                        <label>{field.label}</label>
                        {field.type === 'object' ? (
                            <div>
                                {field.fields.map((nestedField) => (
                                    <div className='form-group' key={nestedField.name}>
                                        <label htmlFor={nestedField.name}>{nestedField.label}</label>
                                        <input type={nestedField.type} id={nestedField.name} name={nestedField.name} />
                                    </div>
                                ))}
                            </div>
                        ) : field.name === 'bikes' ? (
                            <div>
                                {bikes.map((bike, index) => (
                                    <div key={index} className='form-group'>
                                        <input type='text' value={bike} onChange={(e) => handleBikeChange(index, e.target.value)} />
                                        <button type='button' className='add-form-button' onClick={() => handleRemoveBike(index)}>
                                            Ta bort elsparkcykel
                                        </button>
                                    </div>
                                ))}
                                <button type='button' className='add-form-button' onClick={handleAddBike}>
                                    Lägg till elsparkcykel
                                </button>
                            </div>
                        ) : (
                            <input type={field.type} id={field.name} name={field.name} />
                        )}
                    </div>
                ))}
                <button type='submit' className='add-form-button'>
                    Lägg till
                </button>
            </form>
        </div>
    );
}
