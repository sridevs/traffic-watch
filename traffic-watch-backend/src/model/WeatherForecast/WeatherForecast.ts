import { Coordinate } from '../../interface/traffic';

export class WeatherForecast {
  private readonly location: string;
  private readonly coordinate: Coordinate;
  private readonly forecast: string;

  constructor(location: string, coordinate: Coordinate, forecast: string) {
    this.location = location;
    this.coordinate = coordinate;
    this.forecast = forecast;
  }
  calculateDistance(location: Coordinate): number {
    const latDiff = location.latitude - this.coordinate.latitude;
    const lonDiff = location.longitude - this.coordinate.longitude;
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  }

  getClosestForecast(
    location: Coordinate,
    closest: {
      distance: number;
      forecast: WeatherForecast | undefined;
    },
  ) {
    const distance = this.calculateDistance(location);
    return distance < closest.distance ? { forecast: this, distance } : closest;
  }
}
