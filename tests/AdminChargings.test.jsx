import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Chargings from '../src/pages/admin/Chargings';
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

const mockChargings = [
  {
    _id: '1',
    name: 'Station 1',
    bikes: ['cykel1', 'cykel2'],
    cityId: 'stad1',
  },
  {
    _id: '2',
    name: 'Station 2',
    bikes: ['cykel3'],
    cityId: 'stad2',
  },
  {
    _id: '3',
    name: 'Station 3',
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

describe('Chargings Component', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([mockUser]);
    useDataRefresh.mockReturnValue({ refresh: mockRefresh });
    useShowForm.mockReturnValue({ setShowForm: vi.fn() }); 
  });

  afterEach(() => {
    mock.reset();
  });

  test('filter chargingstations on search input', async () => {
    mock.onGet('http://localhost:8000/api/chargingstations').reply(200, mockChargings);
    mock.onGet(/http:\/\/localhost:8000\/api\/cities\/cityid\/.*/).reply((config) => {
      const cityId = config.url.split('/').pop();
      return [200, mockCities[cityId]];
    });

    render(
      <MemoryRouter initialEntries={['/admin/chargings']}>
        <Routes>
          <Route path="/admin/chargings" element={<Chargings />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Station 1')).toBeInTheDocument();
      expect(screen.getByText('Station 2')).toBeInTheDocument();
      expect(screen.getByText('Station 3')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Sök efter laddstation...'), {
      target: { value: 'Station 1' },
    });

    await waitFor(() => {
      expect(screen.getByText('Station 1')).toBeInTheDocument();
      expect(screen.queryByText('Station 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Station 3')).not.toBeInTheDocument();
    });
  });

  test('navigate to chargingstation details page when clicked', async () => {
    mock.onGet('http://localhost:8000/api/chargingstations').reply(200, mockChargings);
    mock.onGet(/http:\/\/localhost:8000\/api\/cities\/cityid\/.*/).reply((config) => {
      const cityId = config.url.split('/').pop();
      return [200, mockCities[cityId]];
    });

    render(
      <MemoryRouter initialEntries={['/admin/chargings']}>
        <Routes>
          <Route path="/admin/chargings" element={<Chargings />} />
          <Route path="/admin/chargingstations/:id" element={<div>Charging Station Details</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Station 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Station 1'));

    await waitFor(() => {
      expect(screen.getByText('Charging Station Details')).toBeInTheDocument();
    });
  });
});
