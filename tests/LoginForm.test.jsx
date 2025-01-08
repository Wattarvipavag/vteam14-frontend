import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../src/components/LoginForm';
import { RoleContextProvider } from '../src/contexts/RoleContext';
import { useSignInWithGithub } from 'react-firebase-hooks/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { act } from 'react';
import Overview from '../src/pages/admin/Overview';

vi.mock('react-firebase-hooks/auth', () => ({
    useSignInWithGithub: vi.fn(() => [
        vi.fn().mockResolvedValue({
            user: {
                uid: '12345',
                displayName: 'Test User',
                email: 'testuser@test.com',
                photoURL: 'https://test.com/photo.jpg',
            },
        }),
        null,
        false,
        null,
    ]),
    useAuthState: vi.fn(() => [{ uid: '12345' }, false]),
}));

vi.mock('axios');
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
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
                    name: 'Test User',
                    email: 'testuser@test.com',
                    profileImage: 'https://test.com/photo.jpg',
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
                name: 'Test User',
                email: 'testuser@test.com',
                profileImage: 'https://test.com/photo.jpg',
            })
        );

        await waitFor(async () => {
            renderWithRoleProvider(<Overview />);
            expect(screen.getByText('Översikt')).toBeInTheDocument();
        });
    });

    it('displays an error message if GitHub login fails', async () => {
        const mockError = new Error('GitHub Error');

        useSignInWithGithub.mockReturnValue([vi.fn().mockRejectedValue(mockError), null, false, mockError]);

        await act(async () => {
            renderWithRoleProvider(<LoginForm />);
        });

        const githubButton = screen.getByText('Logga In Med GitHub');
        fireEvent.click(githubButton);

        await waitFor(async () => {
            expect(await screen.findByText(`GitHub Error: ${mockError.message}`)).toBeInTheDocument();
        });
    });
});

//
// Fixa Github login
//
