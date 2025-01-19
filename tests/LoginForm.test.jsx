import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../src/components/LoginForm';
import { RoleContextProvider } from '../src/contexts/RoleContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { act } from 'react';
import Overview from '../src/pages/admin/Overview';

vi.mock('react-firebase-hooks/auth', () => ({
    useSignInWithGithub: vi.fn(() => [
        vi.fn().mockResolvedValue({
            user: {
                uid: '12345',
                displayName: 'Testitest',
                email: 'test@t.se',
                photoURL: 'https://test.se',
                getIdToken: vi.fn().mockResolvedValue('mockIdToken'),
            },
        }),
        null,
        false,
        null,
    ]), 
    useAuthState: vi.fn(() => [{ 
        uid: '12345',
        getIdToken: vi.fn().mockResolvedValue('mockIdToken')
    }, false]),
}));

vi.mock('axios');

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../src/contexts/DataRefreshContext', () => ({
    useStartSim: vi.fn(() => ({
        startSim: false,
    })),
}));

const renderWithRoleProvider = (ui) => render(<RoleContextProvider>{ui}</RoleContextProvider>);

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        axios.get.mockResolvedValue({
            data: {
                user: {
                    role: 'admin',
                },
            },
        });

        axios.post.mockResolvedValue({
            data: {
                user: {
                    role: 'admin',
                    name: 'Testitest',
                    email: 'test@t.se',
                    profileImage: 'https://test.se',
                },
            },
        });
    });

    it('calls signInWithGithub and navigates on successful login to Overview page', async () => {
        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        await act(async () => {
            renderWithRoleProvider(<LoginForm />);
        });

        const githubButton = screen.getByText('Logga In Med GitHub');
        fireEvent.click(githubButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin');
        });

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8000/api/login',
            expect.objectContaining({
                oauthId: '12345',
                name: 'Testitest',
                email: 'test@t.se',
                profileImage: 'https://test.se',
            })
        );

        await waitFor(async () => {
            renderWithRoleProvider(<Overview />);
            expect(screen.getByText('Översikt')).toBeInTheDocument();
        });
    });
});
