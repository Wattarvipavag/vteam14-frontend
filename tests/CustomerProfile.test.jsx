import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import Profile from '../src/pages/customer/Profile';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

describe('Profile Component', () => {
  it('renders profile information and handles email and money updates', async () => {
    const mockGithubUser = { uid: 'mockUID', accessToken: 'mockAccessToken' };
    useAuthState.mockReturnValue([mockGithubUser, false]);

    const mockUserResponse = {
      data: {
        user: {
          _id: 'mockUserId',
          name: 'Kenneth Haraldsson',
          email: 'Finns ej',
          balance: 100,
        },
      },
    };
    axios.get.mockResolvedValue(mockUserResponse);
    axios.post.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Profil'));

    expect(screen.getByText('Kenneth Haraldsson')).toBeInTheDocument();
    expect(screen.getByText('Finns ej...')).toBeInTheDocument();
    expect(screen.getByText('100 SEK')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('Ange email');
    fireEvent.change(emailInput, { target: { value: 'nymail@mail.se' } });

    const updateEmailButton = screen.getByText('Uppdatera');
    fireEvent.click(updateEmailButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/users/mockUserId',
        expect.objectContaining({
          email: 'nymail@mail.se',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mockAccessToken',
          }),
        })
      );
    });

    const moneyInput = screen.getByPlaceholderText('Ange summa');
    fireEvent.change(moneyInput, { target: { value: '50' } });

    const addMoneyButton = screen.getByText('Lägg till pengar');
    fireEvent.click(addMoneyButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/users/mockUserId',
        expect.objectContaining({
          balance: 150,
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mockAccessToken',
          }),
        })
      );
    });
  });
});
