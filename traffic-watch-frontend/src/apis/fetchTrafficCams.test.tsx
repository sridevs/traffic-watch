import axios, { AxiosResponse } from 'axios';
import { fetchTrafficCamData } from './fetchTrafficCams';
import moment from 'moment';

jest.mock('axios');

describe('fetchTrafficCamData', () => {
    const BASE_URL = 'http://localhost:3000/traffic-watch';

    test('fetches traffic cam data with correct URL and parameters', async () => {
        const date = '2023-05-16';
        const time = '10:00:00';
        const expectedURL = `${BASE_URL}?dateTime=${date}T${time}`;

        const mockResponse: AxiosResponse<any> = { data: 'mocked data' } as AxiosResponse;
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const response = await fetchTrafficCamData(BASE_URL, moment(date), moment(`${date}T${time}`));

        expect(axios.get).toHaveBeenCalledWith(expectedURL);
        expect(response).toEqual(mockResponse.data);
    });

    test('throws an error if the API call fails', async () => {
        const date = '2023-05-16';
        const time = '10:00:00';
        const expectedURL = `${BASE_URL}?dateTime=${date}T${time}`;

        const mockError = new Error('API error');
        (axios.get as jest.Mock).mockRejectedValue(mockError);

        await expect(fetchTrafficCamData(BASE_URL, moment(date), moment(`${date}T${time}`))).rejects.toThrowError(
            'API error'
        );
        expect(axios.get).toHaveBeenCalledWith(expectedURL);
    });
});
