import { TbPlus } from 'react-icons/tb';
import { useShowForm } from '../contexts/ShowFormContext';

export default function AddButton({ text }) {
    const { setShowForm } = useShowForm();

    const handleClick = () => {
        setShowForm(true);
    };

    return (
        <button className='add-button' onClick={handleClick}>
            {text}
            <TbPlus />
        </button>
    );
}
