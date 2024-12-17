import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../src/pages/HomePage';
import LoginForm from '../src/components/LoginForm';

// Mock icons and images
vi.mock('react-icons/tb', () => ({
  TbScooter: () => <span data-testid="TbScooter-icon">Scooter</span>,
}));

vi.mock('../src/images/logo.png', () => ({
  default: 'logo-mock.png',
}));

// Mock LoginForm
vi.mock('../src/components/LoginForm', () => ({
  default: ({ onLogin }) => (
    <button onClick={onLogin} data-testid="login-button">Login with GitHub</button>
  ),
}));

describe('HomePage Component', () => {
  
  it('renders the HomePage component correctly', () => {
    render(<HomePage />);

    // Check the heading
    expect(screen.getByText(/Välkommen till/)).toBeTruthy();

    // Check LoginForm button rendering
    expect(screen.getByTestId('login-button')).toBeTruthy();

    // Check icon rendering
    const scooterIcons = screen.getAllByTestId('TbScooter-icon');
    expect(scooterIcons).toHaveLength(3);
    expect(scooterIcons[0]).toHaveTextContent('Scooter');
    expect(scooterIcons[1]).toHaveTextContent('Scooter');
    expect(scooterIcons[2]).toHaveTextContent('Scooter');
  });

  it('renders login form with GitHub button', async () => {
    render(<LoginForm onLogin={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('Login with GitHub')).toBeInTheDocument();
    });
  });
});
