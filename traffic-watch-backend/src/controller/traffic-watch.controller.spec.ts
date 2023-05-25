import { Test, TestingModule } from '@nestjs/testing';
import { TrafficWatchController } from './traffic-watch.controller';
import { TrafficWatchService } from '../service/traffic-watch.service';
import { BadRequestException } from '@nestjs/common';

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
  });
});
