import { FaGithub } from 'react-icons/fa';

export default function LoginPage() {
    return (
        <form className='login-form'>
            <h2 className='login-title'>Välkommen tillbaka!</h2>
            <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' name='email' placeholder='test@test.com' required />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Lösenord</label>
                <input type='password' id='password' name='password' placeholder='********' required />
            </div>
            <button type='submit' className='login-button'>
                Logga In
            </button>
            <div className='divider'>
                <span>eller</span>
            </div>
            <button type='button' className='github-login-button'>
                <FaGithub />
                Logga In Med GitHub
            </button>
        </form>
    );
}
