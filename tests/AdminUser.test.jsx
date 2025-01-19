import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import User from '../src/pages/admin/User';
import { vi } from 'vitest';

vi.mock('react-firebase-hooks/auth');
vi.mock('axios');

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '123' }),
}));

const mockAuth = { accessToken: 'fake-token' };

describe('<User />', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([mockAuth]);
    axios.get.mockResolvedValueOnce({
      data: {
        user: {
          _id: '123',
          name: 'Testitest',
          email: 'test@hej.se',
          balance: 500,
          profileImage: 'https://test.se',
        },
      },
    });
    axios.get.mockResolvedValueOnce({
      data: {
        rentals: [
          {
            _id: 'rental1',
            active: true,
            totalCost: 200,
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        ],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders user information correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/user/123']}>
        <Routes>
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Testitest'));

    expect(screen.getByText('Testitest')).toBeInTheDocument();
    expect(screen.getByText('test@hej.se')).toBeInTheDocument();
    expect(screen.getByText('500kr')).toBeInTheDocument();
    expect(screen.getByAltText('profile-picture')).toBeInTheDocument();
  });

  test('navigates back when the back is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/user/123']}>
        <Routes>
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Testitest'));

    const backButton = screen.getByRole('button', { name: /Tillbaka Till Användare/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
  });

  test('calls delete API and navigates after deletion', async () => {
    axios.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/user/123']}>
        <Routes>
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Testitest'));

    const deleteButton = screen.getByRole('button', { name: /Ta bort användare/i });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith('http://localhost:8000/api/users/123', {
      headers: {
        Authorization: `Bearer fake-token`,
      },
    }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin/users', { replace: true });
  });
});
