import { WeatherForecast } from './WeatherForecast';
import { Coordinate } from '../../interface/traffic';

describe('WeatherForecast', () => {
  const coordinate1: Coordinate = { latitude: 40.7128, longitude: 74.006 };
  const coordinate2: Coordinate = { latitude: 34.0522, longitude: 118.2437 };
  const forecast1 = new WeatherForecast('Serangoon', coordinate1, 'Sunny');
  const forecast2 = new WeatherForecast('Tampines', coordinate2, 'Cloudy');

  describe('calculateDistance', () => {
    it('calculates the distance between two coordinates correctly', () => {
      const location: Coordinate = { latitude: 41.8781, longitude: 87.6298 };
      const expectedDistance = 13.673545645881324;
      expect(forecast1.calculateDistance(location)).toEqual(expectedDistance);
    });
  });

  describe('getClosestForecast', () => {
    it('returns the closest forecast when the distance is smaller', () => {
      const location: Coordinate = { latitude: 40.7128, longitude: 74.006 };
      const closest = {
        distance: 1000,
        forecast: forecast2,
      };
      const expectedClosest = {
        distance: forecast1.calculateDistance(location),
        forecast: forecast1,
      };
      expect(forecast1.getClosestForecast(location, closest)).toEqual(expectedClosest);
    });

    it('returns the existing closest forecast when the distance is larger', () => {
      const location: Coordinate = { latitude: 34.0522, longitude: 118.2437 };
      const closest = {
        distance: 500,
        forecast: forecast1,
      };
      expect(forecast2.getClosestForecast(location, closest)).toEqual({
        distance: 0,
        forecast: forecast2,
      });
    });
  });
});
