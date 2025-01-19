import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Overview from '../src/pages/admin/Overview';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRole } from '../src/contexts/RoleContext';

vi.mock('axios');

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('../src/contexts/RoleContext', () => ({
  useRole: vi.fn(),
}));

vi.mock('../src/contexts/DataRefreshContext', () => ({
    useStartSim: vi.fn(() => ({
        startSim: false,
    })),
}));

describe('Overview Component', () => {
  const mockUser = {
    accessToken: 'mockAccessToken',
  };

  beforeEach(() => {
    useAuthState.mockReturnValue([mockUser, false, null]);

    useRole.mockReturnValue({
      setRole: vi.fn(),
    });

    axios.get.mockResolvedValue({
      data: {
        cities: 5,
        users: 10,
        bikes: 7,
        parkingAreas: 4,
        chargingstations: 1,
      },
    });
  });

  it('renders Overview component correctly', async () => {
    render(
      <Router>
        <Overview />
      </Router>
    );

    expect(screen.queryByText('Städer')).not.toBeInTheDocument();
    expect(screen.queryByText('Användare')).not.toBeInTheDocument();
    expect(screen.queryByText('Elsparkcyklar')).not.toBeInTheDocument();
    expect(screen.queryByText('Parkeringszoner')).not.toBeInTheDocument();
    expect(screen.queryByText('Laddstationer')).not.toBeInTheDocument();

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(screen.getByText('Städer')).toBeInTheDocument();
    expect(screen.getByText('Användare')).toBeInTheDocument();
    expect(screen.getByText('Elsparkcyklar')).toBeInTheDocument();
    expect(screen.getByText('Parkeringszoner')).toBeInTheDocument();
    expect(screen.getByText('Laddstationer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('fetches and displays statistics after API response', async () => {
    render(
      <Router>
        <Overview />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('uses the correct Authorization token for API call', async () => {
    render(
      <Router>
        <Overview />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/api/stats', expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer mockAccessToken',
      }),
    }));
  });
});
