import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Header from '../src/components/Header';
import { useRole } from '../src/contexts/RoleContext';
import { useSignOut } from 'react-firebase-hooks/auth';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('react-firebase-hooks/auth', () => ({
  useSignOut: vi.fn(),
}));

vi.mock('../src/contexts/RoleContext', () => ({
  useRole: vi.fn(),
}));

describe('Header Component', () => {

  it('logs out successfully when logout button is clicked', async () => {
    const mockSignOut = vi.fn().mockResolvedValue(true);
    const mockSetRole = vi.fn();
    const mockNavigate = vi.fn();

    useSignOut.mockReturnValue([mockSignOut]);
    useRole.mockReturnValue({ setRole: mockSetRole });
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logga ut/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockSetRole).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('does not navigate if sign-out fails', async () => {
    const mockSignOut = vi.fn().mockResolvedValue(false);
    const mockSetRole = vi.fn();
    const mockNavigate = vi.fn();

    useSignOut.mockReturnValue([mockSignOut]);
    useRole.mockReturnValue({ setRole: mockSetRole });
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logga ut/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockSetRole).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
