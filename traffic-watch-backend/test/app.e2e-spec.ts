import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TrafficWatchService } from '../src/service/traffic-watch.service';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import * as request from 'supertest';

jest.mock('axios');
describe('TrafficWatchController (e2e)', () => {
  let app: INestApplication;
  let trafficWatchService: TrafficWatchService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    trafficWatchService = moduleFixture.get<TrafficWatchService>(TrafficWatchService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /traffic-watch', () => {
    it('should return combined traffic and weather information', async () => {
      const dateTime = '2023-05-18T12:00:00';
      const weatherForecasts = [
        {
          location: 'Singapore Central',
          coordinate: { latitude: 1.3521, longitude: 103.8198 },
          forecast: 'Partly cloudy',
        },
        {
          location: 'Singapore East',
          coordinate: { latitude: 1.3456, longitude: 103.983 },
          forecast: 'Sunny',
        },
        {
          location: 'Singapore West',
          coordinate: { latitude: 1.3769, longitude: 103.7764 },
          forecast: 'Rainy',
        },
      ];
      const trafficCameras = [
        {
          camera_id: 'cam1',
          image: 'image1.jpg',
          image_metadata: { width: 1280, height: 720, md5: '12345' },
          location: { latitude: 1.3521, longitude: 103.8198 },
          timestamp: '2023-05-17T10:30:00Z',
        },
        {
          camera_id: 'cam2',
          image: 'image2.jpg',
          image_metadata: { width: 1920, height: 1080, md5: '67890' },
          location: { latitude: 1.2903, longitude: 103.8515 },
          timestamp: '2023-05-17T10:35:00Z',
        },
      ];
      const combinedData = [
        {
          camera_id: 'cam1',
          image: 'image1.jpg',
          image_metadata: { width: 1280, height: 720, md5: '12345' },
          location: { latitude: 1.3521, longitude: 103.8198 },
          locationName: 'Singapore Central',
          weatherForecast: 'Partly cloudy',
          timestamp: '2023-05-17T10:30:00Z',
        },
      ];

      jest.spyOn(trafficWatchService, 'getWeatherForecasts').mockResolvedValue(weatherForecasts);

      jest.spyOn(trafficWatchService, 'getTrafficDetails').mockResolvedValue(trafficCameras);

      const response = await request(app.getHttpServer()).get('/traffic-watch').query({ dateTime }).expect(200);

      expect(trafficWatchService.getWeatherForecasts).toHaveBeenCalledWith(dateTime);
      expect(trafficWatchService.getTrafficDetails).toHaveBeenCalledWith(dateTime);
      expect(response.body).toEqual(combinedData);
    });

    it('should return 400 Bad Request for invalid dateTime format', async () => {
      const invalidDateTime = '2023-05-18'; // Invalid format (missing time)
      const errorMessage = 'Invalid dateTime format. Expected format: YYYY-MM-DD[T]HH:mm:ss';

      const response = await request(app.getHttpServer())
        .get('/traffic-watch')
        .query({ dateTime: invalidDateTime })
        .expect(400);

      expect(response.body.message).toEqual(errorMessage);
    });
  });
});
