import { useParams, useNavigate } from 'react-router';
import { TbArrowBackUp } from 'react-icons/tb';

export default function User() {
    let { id } = useParams();
    let navigate = useNavigate();

    return (
        <>
            <h2>Användare {id}</h2>
            <div className='admin-dashboard-user'>
                <button onClick={() => navigate(-1)}>
                    <TbArrowBackUp />
                    Tillbaka
                </button>
                <p>Här kommer info om användaren!</p>
            </div>
        </>
    );
}
