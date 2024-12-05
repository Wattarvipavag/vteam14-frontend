import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useSignInWithGithub } from 'react-firebase-hooks/auth';
import { useRole } from '../contexts/RoleContext';

export default function LoginForm() {
    const [signInWithGithub, githubUser, githubLoading, githubError] = useSignInWithGithub(auth);
    const [role, setRole] = useRole();
    const navigate = useNavigate();

    const handleGithubLogin = async () => {
        await signInWithGithub();
    };

    useEffect(() => {
        if (githubUser) {
            navigate(`/${role}`);
        }
    }, [githubUser]);

    return (
        <form className='login-form'>
            <h2 className='login-title'>Logga in!</h2>
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

            <button type='button' className='github-login-button' onClick={handleGithubLogin} disabled={githubLoading}>
                <FaGithub />
                {githubLoading ? 'Loading...' : 'Logga In Med GitHub'}
            </button>
            {githubError && <p className='error-message'>GitHub Error: {githubError.message}</p>}
        </form>
    );
}
