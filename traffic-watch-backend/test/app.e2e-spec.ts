import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TrafficWatchService } from '../src/service/traffic-watch.service';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import * as request from 'supertest';
import { WeatherForecast } from '../src/model/WeatherForecast/WeatherForecast';
import { TrafficCamera } from '../src/model/TrafficCamera';
import { TrafficWeather } from '../src/model/TrafficWeather';

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
        new WeatherForecast('Singapore Central', { latitude: 1.3521, longitude: 103.8198 }, 'Partly cloudy'),
        new WeatherForecast('Singapore East', { latitude: 1.3456, longitude: 103.983 }, 'Sunny'),
        new WeatherForecast('Singapore West', { latitude: 1.3769, longitude: 103.7764 }, 'Rainy'),
      ];
      const trafficCameras = [
        new TrafficCamera(
          'cam1',
          'image1.jpg',
          { width: 1280, height: 720, md5: '12345' },
          { latitude: 1.3521, longitude: 103.8198 },
          '2023-05-17T10:30:00Z',
        ),
        new TrafficCamera(
          'cam2',
          'image2.jpg',
          { width: 1920, height: 1080, md5: '67890' },
          { latitude: 1.2903, longitude: 103.8515 },
          '2023-05-17T10:35:00Z',
        ),
      ];
      const trafficWeathers = [
        new TrafficWeather(
          'cam1',
          'image1.jpg',
          { width: 1280, height: 720, md5: '12345' },
          { latitude: 1.3521, longitude: 103.8198 },
          'Singapore Central',
          'Partly cloudy',
          '2023-05-17T10:30:00Z',
        ),
      ];

      jest.spyOn(trafficWatchService, 'getWeatherForecasts').mockResolvedValue(weatherForecasts);

      jest.spyOn(trafficWatchService, 'getTrafficDetails').mockResolvedValue(trafficCameras);

      const response = await request(app.getHttpServer()).get('/traffic-watch').query({ dateTime }).expect(200);

      expect(trafficWatchService.getWeatherForecasts).toHaveBeenCalledWith(dateTime);
      expect(trafficWatchService.getTrafficDetails).toHaveBeenCalledWith(dateTime);
      expect(response.body).toEqual(trafficWeathers);
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
