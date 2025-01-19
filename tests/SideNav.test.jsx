import { render, screen} from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SideNav from '../src/components/SideNav';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRole } from '../src/contexts/RoleContext';

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

describe('SideNav Component', () => {

  it('renders Nav for Admin', () => {
    useRole.mockReturnValue({ role: 'admin' });
    useAuthState.mockReturnValue([{
      displayName: 'Admin',
      photoURL: 'https://A.se',
      accessToken: 'fake-token'
    }, false]);

    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Översikt/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Städer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Starta simulering/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Stoppa simulering/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ta bort ALLT/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ta bort och bygg upp/i })).toBeInTheDocument();
  });

  it('renders Nav for Customer', () => {
    useRole.mockReturnValue({ role: 'customer' });
    useAuthState.mockReturnValue([{
      displayName: 'Customer User',
      photoURL: 'https://A.se',
      accessToken: 'fake-token'
    }, false]);

    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Customer User')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Profil/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Historik/i })).toBeInTheDocument();
  });

  it('renders profile name and photo for the user', () => {
    useRole.mockReturnValue({ role: 'admin' });
    useAuthState.mockReturnValue([{
      displayName: 'Admin',
      photoURL: 'https://A.se',
      accessToken: 'fake-token'
    }, false]);

    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByAltText('profile-picture')).toHaveAttribute('src', 'https://A.se');
  });

  it('does not render buttons for customer role', () => {
    useRole.mockReturnValue({ role: 'customer' });
    useAuthState.mockReturnValue([{
      displayName: 'Customer User',
      photoURL: 'https://A.se',
      accessToken: 'fake-token'
    }, false]);

    render(
      <MemoryRouter>
        <SideNav />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: /Starta simulering/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Stoppa simulering/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Ta bort ALLT/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Ta bort och bygg upp/i })).not.toBeInTheDocument();
  });
});
