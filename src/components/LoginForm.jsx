import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useSignInWithGithub } from 'react-firebase-hooks/auth';
import { useRole } from '../contexts/RoleContext';
import axios from 'axios';

export default function LoginForm() {
    const [signInWithGithub, , , githubLoading, githubError] = useSignInWithGithub(auth);
    const { setRole } = useRole();
    const navigate = useNavigate();

    const handleGithubLogin = async () => {
        try {
            const res = await signInWithGithub();

            const oauthId = res.user.uid;
            const name = res.user.displayName ? res.user.displayName : 'Namnlös?';
            const email = res.user.email ? res.user.email : 'Finns ej';
            const profileImage = res.user.photoURL;

            const data = await axios.post('http://localhost:8000/api/login', {
                oauthId,
                name,
                email,
                profileImage,
            });

            setRole(data.data.user.role);
            navigate(`/${data.data.user.role}`);
        } catch (error) {
            console.error(error);
        }
    };

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
                Logga In Med GitHub
            </button>
            {githubError && <p className='error-message'>GitHub Error: {githubError.message}</p>}
        </form>
    );
}
