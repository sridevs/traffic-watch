import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import TrafficCam from './TrafficCam';

jest.mock('../apis/fetchTrafficCams', () => ({
    fetchTrafficCamData: jest.fn(),
}));

describe('TrafficCam', () => {
    test('renders TrafficCam component', () => {
        render(<TrafficCam/>);

        // Check if the component renders correctly
        expect(screen.getByText('Traffic Images')).toBeInTheDocument();
    });

    test('disables fetch button when date or time is not selected', () => {
        render(<TrafficCam/>);

        const fetchButton = screen.getByRole('button');
        expect(fetchButton).toBeDisabled();

        const datePicker = screen.getByTestId('datePicker');

        fireEvent.change(datePicker, {target: {value: '2023-05-16'}});
        expect(fetchButton).toBeDisabled();
    });
});

