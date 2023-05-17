import { Test, TestingModule } from '@nestjs/testing';
import { TrafficWatchService } from './traffic-watch.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HttpStatus } from '@nestjs/common';
import { NoDataFoundException } from '../ExceptionFilter/NoDataFoundException';
import { TrafficWatchException } from '../ExceptionFilter/TrafficWatchException';

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

    it('should log and throw TrafficWatchException with 500 status code if the request fails unexpectedly', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new Error('Request failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(
        new TrafficWatchException('Failed to fetch traffic details', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should log and throw NoDataException with 404 status code if no data found', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(
        new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND),
      );
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

    it('should log and throw 500 error if the request fails for unknown reason', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new Error('Failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(
        new TrafficWatchException('Failed to fetch Weather details', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
    it('should log and throw error no data found execption if no weather data', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No weather data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(
        new NoDataFoundException('No weather data found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
