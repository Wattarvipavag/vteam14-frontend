import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Parkings from '../src/pages/admin/Parkings';
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

const mockParkings = [
  {
    _id: '1',
    name: 'Parking Area 1',
    bikes: ['cykel1', 'cykel2'],
    cityId: 'stad1',
  },
  {
    _id: '2',
    name: 'Parking Area 2',
    bikes: ['cykel3'],
    cityId: 'stad2',
  },
  {
    _id: '3',
    name: 'Parking Area 3',
    bikes: [],
    cityId: 'stad3',
  },
];

const mockCities = {
  stad1: { name: 'Stad 1' },
  stad2: { name: 'Stad 2' },
  stad3: { name: 'Stad 3' },
};

const mockUser = {
  accessToken: 'mock-token',
};

const mockRefresh = vi.fn();
const mock = new MockAdapter(axios);

describe('Parkings Component', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([mockUser]);
    useDataRefresh.mockReturnValue({ refresh: mockRefresh });
    useShowForm.mockReturnValue({ setShowForm: vi.fn() });
  });

  afterEach(() => {
    mock.reset();
  });

  test('should filter parking areas based on search input', async () => {
    mock.onGet('http://localhost:8000/api/parkingareas').reply(200, mockParkings);
    mock.onGet(/http:\/\/localhost:8000\/api\/cities\/cityid\/.*/).reply((config) => {
      const cityId = config.url.split('/').pop();
      return [200, mockCities[cityId]];
    });

    render(
      <MemoryRouter initialEntries={['/admin/parkings']}>
        <Routes>
          <Route path="/admin/parkings" element={<Parkings />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Parking Area 1')).toBeInTheDocument();
      expect(screen.getByText('Parking Area 2')).toBeInTheDocument();
      expect(screen.getByText('Parking Area 3')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Sök efter parkeringszon...'), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(screen.getByText('Parking Area 1')).toBeInTheDocument();
      expect(screen.queryByText('Parking Area 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Parking Area 3')).not.toBeInTheDocument();
    });
  });

  test('should navigate to parking details page when a parking area is clicked', async () => {
    mock.onGet('http://localhost:8000/api/parkingareas').reply(200, mockParkings);
    mock.onGet(/http:\/\/localhost:8000\/api\/cities\/cityid\/.*/).reply((config) => {
      const cityId = config.url.split('/').pop();
      return [200, mockCities[cityId]];
    });

    render(
      <MemoryRouter initialEntries={['/admin/parkings']}>
        <Routes>
          <Route path="/admin/parkings" element={<Parkings />} />
          <Route path="/admin/parkingareas/:id" element={<div>Parking Details</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Parking Area 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Parking Area 1'));

    await waitFor(() => {
      expect(screen.getByText('Parking Details')).toBeInTheDocument();
    });
  });
});
