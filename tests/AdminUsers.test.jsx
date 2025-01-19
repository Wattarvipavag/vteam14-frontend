import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Users from '../src/pages/admin/Users';
import axios from 'axios';
import { vi } from 'vitest';
import { useAuthState} from 'react-firebase-hooks/auth';
import * as RoleContext from '../src/contexts/RoleContext'; 

vi.mock('axios');

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
  useSignOut: vi.fn(() => [vi.fn()]),
}));

vi.mock('../src/contexts/RoleContext', () => ({
  useRole: vi.fn(),
}));

const mockUser = {
  accessToken: 'mock-token',
};

describe('Users Component', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([mockUser]);
    RoleContext.useRole.mockReturnValue({
      setRole: vi.fn(),
    });
  });

  test('fetch and display users when data is available', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Johan Hansson',
          email: 'Johan@Hansson.se',
          balance: 100,
          rentalHistory: [],
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'Jane@Smith.se',
          balance: 200,
          rentalHistory: [],
        },
      ],
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Johan Hansson')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('filter users on search input', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Johan Hansson',
          email: 'Johan@Hansson.se',
          role: 'user',
          balance: 100,
          rentalHistory: [],
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'Jane@Smith.se',
          role: 'admin',
          balance: 200,
          rentalHistory: [],
        },
      ],
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Johan Hansson')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Sök efter användare...'), {
      target: { value: 'Jane' },
    });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('Johan Hansson')).toBeNull();
    });
  });

  test('should navigate to user details when a user is clicked', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Johan Hansson',
          email: 'Johan@Hansson.se',
          balance: 100,
          rentalHistory: [],
        },
      ],
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Johan Hansson')).toBeInTheDocument();
    });

    const userLink = screen.getByText('Johan Hansson').closest('a');
    expect(userLink).toHaveAttribute('href', '/admin/users/1');
  });

  test('display no users if no users are fetched', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('Johan Hansson')).toBeNull();
      expect(screen.queryByText('Jane Smith')).toBeNull();
    });
  });
});
