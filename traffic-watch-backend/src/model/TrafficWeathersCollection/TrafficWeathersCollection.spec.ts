import { TrafficCamera } from '../TrafficCamera';
import { TrafficWeather } from '../TrafficWeather';
import { WeatherForecast } from '../WeatherForecast/WeatherForecast';
import { TrafficWeathersCollection } from './TrafficWeathersCollection';

describe('TrafficWeathersCollection', () => {
  describe('combineTrafficAndWeather', () => {
    let trafficCameras: TrafficCamera[];
    let weatherForecasts: WeatherForecast[];
    let trafficWeathersCollection;

    beforeEach(() => {
      trafficWeathersCollection = new TrafficWeathersCollection();
      trafficCameras = [
        new TrafficCamera(
          'cam1',
          'image1.jpg',
          { width: 1280, height: 720, md5: '12345' },
          { latitude: 1.3512, longitude: 103.8111 },
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

      weatherForecasts = [
        new WeatherForecast('Singapore Central', { latitude: 1.3521, longitude: 103.8198 }, 'Partly cloudy'),
        new WeatherForecast('Singapore East', { latitude: 1.3456, longitude: 103.983 }, 'Sunny'),
        new WeatherForecast('Singapore West', { latitude: 1.3769, longitude: 103.7764 }, 'Rainy'),
      ];
    });

    it('should combine traffic cameras and weather forecasts into a traffic weather list', () => {
      const expectedList: TrafficWeather[] = [
        new TrafficWeather(
          'cam1',
          'image1.jpg',
          { width: 1280, height: 720, md5: '12345' },
          { latitude: 1.3512, longitude: 103.8111 },
          'Singapore Central',
          'Partly cloudy',
          '2023-05-17T10:30:00Z',
        ),
      ];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather(trafficCameras, weatherForecasts);

      expect(combinedList).toEqual(expectedList);
    });

    it('should combine traffic cameras and weather forecasts with duplicate location names', () => {
      const duplicateForecast: WeatherForecast = new WeatherForecast(
        'Singapore Central',
        { latitude: 1.3521, longitude: 103.8198 },
        'Partly cloudy',
      );

      weatherForecasts.push(duplicateForecast);

      const expectedList: TrafficWeather[] = [
        new TrafficWeather(
          'cam1',
          'image1.jpg',
          { width: 1280, height: 720, md5: '12345' },
          { latitude: 1.3512, longitude: 103.8111 },
          'Singapore Central',
          'Partly cloudy',
          '2023-05-17T10:30:00Z',
        ),
      ];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather(trafficCameras, weatherForecasts);

      expect(combinedList).toEqual(expectedList);
    });

    it('should update existing TrafficWeather object if new distance is shorter', () => {
      const newTrafficCamera: TrafficCamera = new TrafficCamera(
        'cam3',
        'image3.jpg',
        { width: 1280, height: 720, md5: '54321' },
        { latitude: 1.3512, longitude: 103.8113 },
        '2023-05-17T10:20:00Z',
      );

      const expectedList: TrafficWeather[] = [
        new TrafficWeather(
          'cam3',
          'image3.jpg',
          { width: 1280, height: 720, md5: '54321' },
          { latitude: 1.3512, longitude: 103.8113 },
          'Singapore Central',
          'Partly cloudy',
          '2023-05-17T10:20:00Z',
        ),
      ];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather(
        [...trafficCameras, newTrafficCamera],
        weatherForecasts,
      );

      expect(combinedList).toEqual(expectedList);
    });

    it('should combine traffic cameras and weather forecasts with no matching location', () => {
      const unknownLocationCamera: TrafficCamera = new TrafficCamera(
        'cam3',
        'image3.jpg',
        { width: 1280, height: 720, md5: '54321' },
        { latitude: 1.1111, longitude: 103.9999 },
        '2023-05-17T10:40:00Z',
      );

      trafficCameras.push(unknownLocationCamera);

      const expectedList: TrafficWeather[] = [
        new TrafficWeather(
          'cam1',
          'image1.jpg',
          { width: 1280, height: 720, md5: '12345' },
          { latitude: 1.3512, longitude: 103.8111 },
          'Singapore Central',
          'Partly cloudy',
          '2023-05-17T10:30:00Z',
        ),
        new TrafficWeather(
          'cam3',
          'image3.jpg',
          { width: 1280, height: 720, md5: '54321' },
          { latitude: 1.1111, longitude: 103.9999 },
          'Singapore East',
          'Sunny',
          '2023-05-17T10:40:00Z',
        ),
      ];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather(trafficCameras, weatherForecasts);

      expect(combinedList).toEqual(expectedList);
    });

    it('should combine empty traffic cameras and weather forecasts', () => {
      const expectedList: TrafficWeather[] = [];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather([], []);

      expect(combinedList).toEqual(expectedList);
    });

    it('should combine empty traffic cameras with weather forecasts', () => {
      const expectedList: TrafficWeather[] = [];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather([], weatherForecasts);

      expect(combinedList).toEqual(expectedList);
    });

    it('should combine traffic cameras with empty weather forecasts', () => {
      const expectedList: TrafficWeather[] = [];

      const combinedList = trafficWeathersCollection.combineTrafficAndWeather(trafficCameras, []);

      expect(combinedList).toEqual(expectedList);
    });
  });
});
