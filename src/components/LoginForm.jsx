import { useEffect } from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useSignInWithGithub, useSignInWithGoogle } from 'react-firebase-hooks/auth';

export default function LoginForm() {
    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
    const [signInWithGithub, githubUser, githubLoading, githubError] = useSignInWithGithub(auth);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        await signInWithGoogle();
    };

    const handleGithubLogin = async () => {
        await signInWithGithub();
    };

    useEffect(() => {
        if (googleUser || githubUser) {
            navigate('/admin');
        }
    }, [googleUser, githubUser]);

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
            <button type='button' className='google-login-button' onClick={handleGoogleLogin} disabled={googleLoading}>
                <FaGoogle />
                {googleLoading ? 'Loading...' : 'Logga In Med Google'}
            </button>
            <button type='button' className='github-login-button' onClick={handleGithubLogin} disabled={githubLoading}>
                <FaGithub />
                {githubLoading ? 'Loading...' : 'Logga In Med GitHub'}
            </button>
            {googleError && <p className='error-message'>Google Error: {googleError.message}</p>}
            {githubError && <p className='error-message'>GitHub Error: {githubError.message}</p>}
        </form>
    );
}
