import { Test, TestingModule } from '@nestjs/testing';
import { TrafficWatchService } from './traffic-watch.service';
import { HttpModule } from '@nestjs/axios';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HttpStatus } from '@nestjs/common';
import { NoDataFoundException } from '../ExceptionFilter/NoDataFoundException';
import { TrafficWatchException } from '../ExceptionFilter/TrafficWatchException';
import { TrafficCamera } from '../model/TrafficCamera';

describe('TrafficWatchService', () => {
  let trafficWatchService: TrafficWatchService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [TrafficWatchService],
    }).compile();

    trafficWatchService = moduleFixture.get<TrafficWatchService>(TrafficWatchService);
  });

  describe('getTrafficDetails', () => {
    it('should return traffic details', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const trafficCamera = new TrafficCamera(
        'cam1',
        'image1.jpg',
        { width: 1280, height: 720, md5: '12345' },
        { latitude: 1.3512, longitude: 103.8111 },
        '2023-05-17T10:30:00Z',
      );
      const expectedData = {
        // Mocked response data
        items: [{ cameras: [trafficCamera] }],
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

      expect(result).toEqual([trafficCamera]);
    });

    it('should throw TrafficWatchException with 500 status code if the request fails unexpectedly', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new Error('Request failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(
        new TrafficWatchException('Failed to fetch traffic details', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should throw NoDataException with 404 status code if no data found', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(
        new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND),
      );
    });
    it('should throw NoDataException with 404 status code if no data found', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({});

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(error);
    });
    it('should throw NoDataException with 404 status code if no items in data', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: {} });

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(error);
    });
    it('should throw NoDataException with 404 status code if no items in data', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: {} });

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(error);
    });
    it('should throw NoDataException with 404 status code if items is empty', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { items: [] } });

      await expect(trafficWatchService.getTrafficDetails(dateTime)).rejects.toThrowError(error);
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

    it('should throw 500 error if the request fails for unknown reason', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new Error('Failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(
        new TrafficWatchException('Failed to fetch Weather details', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
    it('should throw error no data found execption if no weather data', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No weather data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(
        new NoDataFoundException('No weather data found', HttpStatus.NOT_FOUND),
      );
    });
    it('should throw error no data found execption if no data in response', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({});

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(error);
    });
    it('should throw error no data found execption if no area_metadata in response', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: {} });

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(error);
    });
    it('should throw error no data found execption if no items in response', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { area_metadata: {} } });

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(error);
    });
    it('should throw error no data found execption if items is empty in response', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const error = new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { area_metadata: {}, items: [] } });

      await expect(trafficWatchService.getWeatherForecasts(dateTime)).rejects.toThrowError(error);
    });
  });
});
