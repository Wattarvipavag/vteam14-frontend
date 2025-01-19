import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Cities from '../src/pages/admin/Cities';
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

const mockCities = [
  {
    _id: '1',
    name: 'Stad 1',
    bikes: ['cykel1', 'cykel2'],
    parkingAreas: ['area1', 'area2'],
    chargingStations: ['charging1'],
    minuteRate: 5,
    surcharge: 10,
    discount: 5,
  },
  {
    _id: '2',
    name: 'Stad 2',
    bikes: ['bike3'],
    parkingAreas: ['area3'],
    chargingStations: ['charging2', 'charging3'],
    minuteRate: 6,
    surcharge: 15,
    discount: 10,
  },
  {
    _id: '3',
    name: 'Stad 3',
    bikes: [],
    parkingAreas: [],
    chargingStations: [],
    minuteRate: 7,
    surcharge: 20,
    discount: 0,
  },
];

const mockUser = {
  accessToken: 'mock-token',
};

const mockRefresh = vi.fn();
const mock = new MockAdapter(axios);

describe('Cities Component', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([mockUser]);
    useDataRefresh.mockReturnValue({ refresh: mockRefresh });
    useShowForm.mockReturnValue({ setShowForm: vi.fn() });
  });

  afterEach(() => {
    mock.reset();
  });

  test('filter cities on search input', async () => {
    mock.onGet('http://localhost:8000/api/cities').reply(200, mockCities);

    render(
      <MemoryRouter initialEntries={['/admin/cities']}>
        <Routes>
          <Route path="/admin/cities" element={<Cities />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Stad 1')).toBeInTheDocument();
      expect(screen.getByText('Stad 2')).toBeInTheDocument();
      expect(screen.getByText('Stad 3')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Sök efter stad...'), {
      target: { value: 'Stad 1' },
    });

    await waitFor(() => {
      expect(screen.getByText('Stad 1')).toBeInTheDocument();
      expect(screen.queryByText('Stad 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Stad 3')).not.toBeInTheDocument();
    });
  });

  test('show city details: bikes, parking areas, and charging stations', async () => {
    mock.onGet('http://localhost:8000/api/cities').reply(200, mockCities);
  
    render(
      <MemoryRouter initialEntries={['/admin/cities']}>
        <Routes>
          <Route path="/admin/cities" element={<Cities />} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Stad 1')).toBeInTheDocument();
    });
  
    const cityDetails = screen.getAllByText('2');
  
    expect(cityDetails[0]).toBeInTheDocument();

    expect(cityDetails[1]).toBeInTheDocument();
  });
});
