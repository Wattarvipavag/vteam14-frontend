import logo from '../images/logo.png';

export default function Spinner() {
    return (
        <div
            className='spinner-container'
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${logo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            <div className='spinner'>
                <div></div>
                <p>Loading...</p>
            </div>
        </div>
    );
}
