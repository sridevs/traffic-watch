import { Coordinate } from './traffic';

export interface WeatherForecast {
  location: string;
  coordinate: Coordinate;
  forecast: string;
}
