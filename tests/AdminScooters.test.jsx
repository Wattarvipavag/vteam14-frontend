import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom'; 
import Scooters from '../src/pages/admin/Scooters'; 
import axios from 'axios';
import { vi } from 'vitest';
import { useAuthState } from 'react-firebase-hooks/auth';
import MockAdapter from 'axios-mock-adapter';
import { useDataRefresh } from '../src/contexts/DataRefreshContext';
import { useShowForm } from '../src/contexts/ShowFormContext';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('../src/contexts/DataRefreshContext', () => ({
  useDataRefresh: vi.fn(),
}));

vi.mock('../src/contexts/ShowFormContext', () => ({
  useShowForm: vi.fn(),
}));

const mockScooters = [
  {
    _id: '1',
    available: true,
    charge: 80,
    speed: 25,
    chargingStationId: 'station1',
    parkingAreaId: 'area1',
  },
  {
    _id: '2',
    available: false,
    charge: 40,
    speed: 20,
    chargingStationId: 'station2',
    parkingAreaId: null,
  },
  {
    _id: '3',
    available: true,
    charge: 60,
    speed: 18,
    chargingStationId: null,
    parkingAreaId: 'area2',
  },
];

const mockUser = {
  accessToken: 'mock-token',
};

const mockRefresh = vi.fn();
const mock = new MockAdapter(axios);

describe('Scooters Component', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([mockUser]);
    useDataRefresh.mockReturnValue({ refresh: mockRefresh });
    useShowForm.mockReturnValue({ setShowForm: vi.fn() });
  });

  afterEach(() => {
    mock.reset();
  });

  test('fetch and display scooters data', async () => {
    mock.onGet('http://localhost:8000/api/bikes').reply(200, mockScooters);

    render(
      <MemoryRouter initialEntries={['/admin/scooters']}>
        <Routes>
          <Route path="/admin/scooters" element={<Scooters />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  test('filter scooters on search input', async () => {
    mock.onGet('http://localhost:8000/api/bikes').reply(200, mockScooters);

    render(
      <MemoryRouter initialEntries={['/admin/scooters']}>
        <Routes>
          <Route path="/admin/scooters" element={<Scooters />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Sök efter elsparkcykel...'), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });
  });

  test('display battery levels with correct color', async () => {
    mock.onGet('http://localhost:8000/api/bikes').reply(200, mockScooters);
  
    render(
      <MemoryRouter initialEntries={['/admin/scooters']}>
        <Routes>
          <Route path="/admin/scooters" element={<Scooters />} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      const scooter1Charge = screen.getByText(mockScooters[0].charge + '%');
      const scooter2Charge = screen.getByText(mockScooters[1].charge + '%');
      const scooter3Charge = screen.getByText(mockScooters[2].charge + '%');
  
      expect(scooter1Charge).toHaveStyle('color: rgb(0, 128, 0)');
      expect(scooter2Charge).toHaveStyle('color: rgb(235, 132, 31)');
      expect(scooter3Charge).toHaveStyle('color: rgb(253, 206, 6)');
    });
  });

  test('navigate to scooter details page when clicked', async () => {
    mock.onGet('http://localhost:8000/api/bikes').reply(200, mockScooters);

    render(
      <MemoryRouter initialEntries={['/admin/scooters']}>
        <Routes>
          <Route path="/admin/scooters" element={<Scooters />} />
          <Route path="/admin/bikes/:id" element={<div>Bike Details</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockScooters[0]._id)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(mockScooters[0]._id));

    await waitFor(() => {
      expect(screen.getByText('Bike Details')).toBeInTheDocument();
    });
  });
});
