import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import History from '../src/pages/customer/History';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';

vi.mock('react-firebase-hooks/auth', () => ({
    useAuthState: vi.fn(),
}));

vi.mock('axios');

const mockGithubUser = {
    uid: '12345',
    accessToken: 'mock-access-token',
};

describe('History Component', () => {
    it('render loading state and then fetch data', async () => {
        useAuthState.mockReturnValue([mockGithubUser]);

        axios.get.mockResolvedValueOnce({
            data: {
                user: { _id: 'user-id' },
            },
        });

        axios.get.mockResolvedValueOnce({
            data: {
                rentals: [
                    {
                        _id: 'rental-id-1',
                        createdAt: '2025-01-15T00:00:00Z',
                        updatedAt: '2025-01-16T00:00:00Z',
                        totalCost: 100,
                        status: true,
                    },
                ],
            },
        });

        render(<History />);

        await waitFor(() => screen.getByText('rental-id-1'));

        expect(screen.getByText('Historik')).toBeInTheDocument();
        expect(screen.getByText('rental-id-1')).toBeInTheDocument();
        expect(screen.getByText('100kr')).toBeInTheDocument();
        expect(screen.getByText('Aktiv')).toBeInTheDocument();
    });

    it('render "No history" if no rentals are available', async () => {

        useAuthState.mockReturnValue([mockGithubUser]);

        axios.get.mockResolvedValueOnce({
            data: {
                user: { _id: 'user-id' },
            },
        });

        axios.get.mockResolvedValueOnce({
            data: {
                rentals: [],
            },
        });

        render(<History />);

        await waitFor(() => screen.getByText('Historik'));

        expect(screen.getByText('Historik')).toBeInTheDocument();
    });
});
