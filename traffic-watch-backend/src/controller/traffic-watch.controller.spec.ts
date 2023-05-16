import { Test, TestingModule } from '@nestjs/testing';
import { TrafficWatchController } from './traffic-watch.controller';
import { TrafficWatchService } from '../service/traffic-watch.service';

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
      expect(await trafficWatchController.getTrafficWeatherInfo('05/04/2023T')).toEqual(mockData);
    });
  });
});
