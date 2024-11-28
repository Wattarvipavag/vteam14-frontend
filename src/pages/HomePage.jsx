import LoginForm from '../components/LoginForm';
import { TbScooter } from 'react-icons/tb';
import logo from '../images/logo.png';

export default function HomePage() {
    return (
        <div className='homepage'>
            <div className='homepage-left'>
                <h1>
                    Välkommen till <span className='brand'>Watt är vi på väg?</span>
                </h1>
                <p>
                    <span className='brand'>Watt är vi på väg?</span> är din ultimata lösning för hållbar och smidig transport i staden.
                    Utforska vår app för att hitta närmaste elsparkcykel, spåra din resa och bidra till en grönare framtid. Enkel, snabb och
                    miljövänlig.
                </p>
                <ul>
                    <li>
                        <TbScooter /> Enkel att använda
                    </li>
                    <li>
                        <TbScooter /> Miljövänlig transport
                    </li>
                    <li>
                        <TbScooter /> Tillgänglig i flera städer
                    </li>
                </ul>
            </div>
            <div
                className='homepage-right'
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${logo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                <LoginForm />
            </div>
        </div>
    );
}
