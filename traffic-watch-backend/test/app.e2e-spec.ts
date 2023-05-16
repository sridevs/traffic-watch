import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TrafficWatchService } from '../src/service/traffic-watch.service';
import { INestApplication } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

jest.mock('axios');
describe('TrafficWatchController (e2e)', () => {
  let app: INestApplication;
  let trafficWatchService: TrafficWatchService;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    trafficWatchService = moduleFixture.get<TrafficWatchService>(
      TrafficWatchService,
    );
    httpService = moduleFixture.get<HttpService>(HttpService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/traffic-watch', () => {
    it('GET /traffic-watch should return traffic details', async () => {
      const dateTime = '2023-05-16T12:00:00';

      const expectedData = {
        // Mocked response data
        items: [],
      };

      const response: AxiosResponse = {
        data: expectedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      jest
        .spyOn(axios, 'get')
        .mockResolvedValue(response);

      const result = await trafficWatchService.getTrafficDetails(dateTime);

      expect(result).toEqual(expectedData.items);
    });
  });
});
