import { Test, TestingModule } from '@nestjs/testing';
import { TrafficWatchService } from './traffic-watch.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

describe('TrafficWatchService', () => {
  let trafficWatchService: TrafficWatchService;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [TrafficWatchService],
    }).compile();

    trafficWatchService = moduleFixture.get<TrafficWatchService>(TrafficWatchService);
    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  describe('getTrafficDetails', () => {
    it('should return traffic details', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const expectedData = {
        // Mocked response data
        items: [{ cameras: [] }],
      };

      const response: AxiosResponse = {
        data: expectedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      jest.spyOn(axios, 'get').mockResolvedValueOnce(response);

      const result = await trafficWatchService.getTrafficDetails(dateTime);

      expect(result).toEqual([]);
    });

    it('should log an error if the request fails', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new Error('Request failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await trafficWatchService.getTrafficDetails(dateTime);

      expect(consoleSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('getWeatherForecasts', () => {
    it('should return weather forecasts', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const expectedData = {
        // Mocked response data
        area_metadata: [
          { name: 'Location 1', label_location: 'Coordinates 1' },
          { name: 'Location 2', label_location: 'Coordinates 2' },
        ],
        items: [
          {
            forecasts: [
              { area: 'Location 1', forecast: 'Forecast 1' },
              { area: 'Location 2', forecast: 'Forecast 2' },
            ],
          },
        ],
      };

      const response: AxiosResponse = {
        data: expectedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      jest.spyOn(axios, 'get').mockResolvedValueOnce(response);

      const result = await trafficWatchService.getWeatherForecasts(dateTime);

      expect(result).toEqual([
        {
          location: 'Location 1',
          coordinate: 'Coordinates 1',
          forecast: 'Forecast 1',
        },
        {
          location: 'Location 2',
          coordinate: 'Coordinates 2',
          forecast: 'Forecast 2',
        },
      ]);
    });

    it('should log an error if the request fails', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new Error('Request failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await trafficWatchService.getWeatherForecasts(dateTime);

      expect(consoleSpy).toHaveBeenCalledWith(error);
    });
  });
});
