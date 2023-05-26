import { Test, TestingModule } from '@nestjs/testing';
import { TrafficWatchController } from './traffic-watch.controller';
import { TrafficWatchService } from '../service/traffic-watch.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { TrafficWatchException } from '../ExceptionFilter/TrafficWatchException';

describe('TrafficWatchController', () => {
  let trafficWatchController: TrafficWatchController;
  let trafficWatchService: TrafficWatchService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TrafficWatchController],
      providers: [TrafficWatchService],
    }).compile();

    trafficWatchController = app.get<TrafficWatchController>(TrafficWatchController);
    trafficWatchService = app.get<TrafficWatchService>(TrafficWatchService);
  });

  describe('root', () => {
    it('should return traffic details', async () => {
      const mockData = [];
      jest.spyOn(trafficWatchService, 'getTrafficDetails').mockResolvedValue(mockData);
      jest.spyOn(trafficWatchService, 'getWeatherForecasts').mockResolvedValue(mockData);
      expect(await trafficWatchController.getTrafficWeatherInfo('2023-05-04T00:00:00')).toEqual(mockData);
    });

    it('should throw BadRequestException for invalid date-time format', async () => {
      const invalidDateTime = '2023-05-04T00:00'; // Invalid date-time format, missing seconds
      const expectedError = new BadRequestException('Invalid dateTime format. Expected format: YYYY-MM-DD[T]HH:mm:ss');

      await expect(() => trafficWatchController.getTrafficWeatherInfo(invalidDateTime)).rejects.toThrowError(
        expectedError,
      );
    });
    it('should throw TrafficWatchException with 500 status code if the request fails unexpectedly', async () => {
      const invalidDateTime = '2023-05-04T00:00:00'; // Invalid date-time format, missing seconds

      const error = new Error('Request failed');

      jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

      await expect(() => trafficWatchController.getTrafficWeatherInfo(invalidDateTime)).rejects.toThrowError(
        new TrafficWatchException('Failed to fetch Weather details', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
