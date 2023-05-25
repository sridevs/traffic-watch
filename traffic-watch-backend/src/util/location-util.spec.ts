import { combineTrafficAndWeather } from './location-util';
import { TrafficCamera, TrafficWeather } from '../interface/traffic';
import { WeatherForecast } from '../interface/weatherForecast';

describe('combineTrafficAndWeather', () => {
  let trafficCameras: TrafficCamera[];
  let weatherForecasts: WeatherForecast[];

  beforeEach(() => {
    trafficCameras = [
      {
        camera_id: 'cam1',
        image: 'image1.jpg',
        image_metadata: { width: 1280, height: 720, md5: '12345' },
        location: { latitude: 1.3512, longitude: 103.8111 },
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

    weatherForecasts = [
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
  });

  it('should combine traffic cameras and weather forecasts into a traffic weather list', () => {
    const expectedList: TrafficWeather[] = [
      {
        camera_id: 'cam1',
        image: 'image1.jpg',
        image_metadata: { width: 1280, height: 720, md5: '12345' },
        location: { latitude: 1.3512, longitude: 103.8111 },
        locationName: 'Singapore Central',
        weatherForecast: 'Partly cloudy',
        timestamp: '2023-05-17T10:30:00Z',
      },
    ];

    const combinedList = combineTrafficAndWeather(trafficCameras, weatherForecasts);

    expect(combinedList).toEqual(expectedList);
  });

  it('should combine traffic cameras and weather forecasts with duplicate location names', () => {
    const duplicateForecast: WeatherForecast = {
      location: 'Singapore Central',
      coordinate: { latitude: 1.3521, longitude: 103.8198 },
      forecast: 'Partly cloudy',
    };

    weatherForecasts.push(duplicateForecast);

    const expectedList: TrafficWeather[] = [
      {
        camera_id: 'cam1',
        image: 'image1.jpg',
        image_metadata: { width: 1280, height: 720, md5: '12345' },
        location: { latitude: 1.3512, longitude: 103.8111 },
        locationName: 'Singapore Central',
        weatherForecast: 'Partly cloudy',
        timestamp: '2023-05-17T10:30:00Z',
      },
    ];

    const combinedList = combineTrafficAndWeather(trafficCameras, weatherForecasts);

    expect(combinedList).toEqual(expectedList);
  });

  it('should update existing TrafficWeather object if new distance is shorter', () => {
    const newTrafficCamera: TrafficCamera = {
      camera_id: 'cam3',
      image: 'image3.jpg',
      image_metadata: { width: 1280, height: 720, md5: '54321' },
      location: { latitude: 1.3512, longitude: 103.8113 },
      timestamp: '2023-05-17T10:20:00Z',
    };

    const expectedList: TrafficWeather[] = [
      {
        camera_id: 'cam3',
        image: 'image3.jpg',
        image_metadata: { width: 1280, height: 720, md5: '54321' },
        location: { latitude: 1.3512, longitude: 103.8113 },
        locationName: 'Singapore Central',
        weatherForecast: 'Partly cloudy',
        timestamp: '2023-05-17T10:20:00Z',
      },
    ];

    const combinedList = combineTrafficAndWeather([...trafficCameras, newTrafficCamera], weatherForecasts);

    expect(combinedList).toEqual(expectedList);
  });

  it('should combine traffic cameras and weather forecasts with no matching location', () => {
    const unknownLocationCamera: TrafficCamera = {
      camera_id: 'cam3',
      image: 'image3.jpg',
      image_metadata: { width: 1280, height: 720, md5: '54321' },
      location: { latitude: 1.1111, longitude: 103.9999 },
      timestamp: '2023-05-17T10:40:00Z',
    };

    trafficCameras.push(unknownLocationCamera);

    const expectedList: TrafficWeather[] = [
      {
        camera_id: 'cam1',
        image: 'image1.jpg',
        image_metadata: { width: 1280, height: 720, md5: '12345' },
        location: { latitude: 1.3512, longitude: 103.8111 },
        locationName: 'Singapore Central',
        weatherForecast: 'Partly cloudy',
        timestamp: '2023-05-17T10:30:00Z',
      },
      {
        camera_id: 'cam3',
        image: 'image3.jpg',
        image_metadata: { width: 1280, height: 720, md5: '54321' },
        location: { latitude: 1.1111, longitude: 103.9999 },
        locationName: 'Singapore East',
        weatherForecast: 'Sunny',
        timestamp: '2023-05-17T10:40:00Z',
      },
    ];

    const combinedList = combineTrafficAndWeather(trafficCameras, weatherForecasts);

    expect(combinedList).toEqual(expectedList);
  });

  it('should combine empty traffic cameras and weather forecasts', () => {
    const expectedList: TrafficWeather[] = [];

    const combinedList = combineTrafficAndWeather([], []);

    expect(combinedList).toEqual(expectedList);
  });

  it('should combine empty traffic cameras with weather forecasts', () => {
    const expectedList: TrafficWeather[] = [];

    const combinedList = combineTrafficAndWeather([], weatherForecasts);

    expect(combinedList).toEqual(expectedList);
  });

  it('should combine traffic cameras with empty weather forecasts', () => {
    const expectedList: TrafficWeather[] = [];

    const combinedList = combineTrafficAndWeather(trafficCameras, []);

    expect(combinedList).toEqual(expectedList);
  });
});
