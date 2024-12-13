import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/pages/HomePage';
import LoginForm from '../src/components/LoginForm';
import { TbScooter } from 'react-icons/tb';
import logo from '../src/images/logo.png';
import { useRole } from '../src/contexts/RoleContext';

// Mocka iconer och bilder
vi.mock('react-icons/tb', () => ({
  TbScooter: () => <span data-testid="TbScooter-icon">Scooter</span>,
}));

vi.mock('../src/images/logo.png', () => ({
  default: 'logo-mock.png',
}));

// Mocka LoginForm
vi.mock('../src/components/LoginForm', () => ({
  default: () => <div data-testid="login-form">Mock LoginForm</div>,
}));

// Mock useRole
vi.mock('../src/contexts/RoleContext', () => ({
  useRole: vi.fn(() => ({
    setRole: vi.fn(),
  })),
}));

describe('HomePage Component', () => {
  it('renders the HomePage component correctly', () => {
    render(<HomePage />);

    // Heading
    expect(screen.getByText(/Välkommen till/)).toBeTruthy();

    // Loginform
    expect(screen.getByTestId('login-form')).toBeTruthy();

    // Icon rendering
    const scooterIcons = screen.getAllByTestId('TbScooter-icon');
    expect(scooterIcons).toHaveLength(3);

    expect(scooterIcons[0]).toHaveTextContent('Scooter');
    expect(scooterIcons[1]).toHaveTextContent('Scooter');
    expect(scooterIcons[2]).toHaveTextContent('Scooter');
  });
});
