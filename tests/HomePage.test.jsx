import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/pages/HomePage';

vi.mock('react-icons/tb', () => ({
    TbScooter: () => <span data-testid='TbScooter-icon'>Scooter</span>,
}));

vi.mock('../src/images/logo.png', () => ({
    default: 'logo-mock.png',
}));

vi.mock('../src/components/LoginForm', () => ({
    default: () => <div data-testid='login-form'>Mock LoginForm</div>,
}));

vi.mock('../src/contexts/RoleContext', () => ({
    useRole: vi.fn(() => ({
        setRole: vi.fn(),
    })),
}));

describe('HomePage Component', () => {
    it('renders the HomePage component correctly', () => {
        render(<HomePage />);

        expect(screen.getByText(/Välkommen till/)).toBeTruthy();

        expect(screen.getByTestId('login-form')).toBeTruthy();

        const scooterIcons = screen.getAllByTestId('TbScooter-icon');
        expect(scooterIcons).toHaveLength(3);

        expect(scooterIcons[0]).toHaveTextContent('Scooter');
        expect(scooterIcons[1]).toHaveTextContent('Scooter');
        expect(scooterIcons[2]).toHaveTextContent('Scooter');
    });
});
