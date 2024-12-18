import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import Overview from '../src/pages/admin/Overview';

vi.mock('axios');

describe('Overview Component', () => {
    it('renders cards with correct placeholders after API response', async () => {
        axios.get.mockResolvedValue({
            data: {
                cities: 5,
                users: 10,
                bikes: 7,
                parkingAreas: 4,
                chargingstations: 1,
            },
        });

        render(<Overview />);

        const citiesText = await screen.findByText('Städer');
        expect(citiesText).toBeInTheDocument();

        const usersText = await screen.findByText('Användare');
        expect(usersText).toBeInTheDocument();

        const scootersText = await screen.findByText('Elsparkcyklar');
        expect(scootersText).toBeInTheDocument();

        const parkingAreasText = await screen.findByText('Parkeringszoner');
        expect(parkingAreasText).toBeInTheDocument();

        const chargingAreasText = await screen.findByText('Laddstationer');
        expect(chargingAreasText).toBeInTheDocument();

        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
