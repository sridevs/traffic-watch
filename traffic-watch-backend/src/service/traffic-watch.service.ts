import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherForecast } from '../interface/weatherForecast';
import { TrafficCamera } from '../interface/traffic';
import { NoDataFoundException } from '../ExceptionFilter/NoDataFoundException';
import { TrafficWatchException } from '../ExceptionFilter/TrafficWatchException';

@Injectable()
export class TrafficWatchService {
  async getTrafficDetails(dateTime: string): Promise<TrafficCamera[]> {
    try {
      const response = await axios.get(
        `https://api.data.gov.sg/v1/transport/traffic-images?date_time=${encodeURIComponent(dateTime)}`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
      if (!response.data || !response.data.items || Object.keys(response.data.items[0]).length === 0) {
        throw new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);
      }
      return response.data.items[0].cameras;
    } catch (err) {
      console.log(err);
      if (err instanceof NoDataFoundException) throw err;
      throw new TrafficWatchException('Failed to fetch traffic details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWeatherForecasts(dateTime: string): Promise<WeatherForecast[]> {
    try {
      const response = await axios.get(
        `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=${encodeURIComponent(dateTime)}`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
      const { area_metadata, items } = response.data;

      if (!response.data || !area_metadata || !items || !items.length || Object.keys(items[0]).length === 0)
        throw new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);
      const forecastsLocationMap = {};
      for (const forecast of items[0].forecasts) {
        forecastsLocationMap[forecast.area] = forecast.forecast;
      }

      return area_metadata.map(
        (data) =>
          ({
            location: data.name,
            coordinate: data.label_location,
            forecast: forecastsLocationMap[data.name],
          } as WeatherForecast),
      );
    } catch (err) {
      console.log(err);
      if (err instanceof NoDataFoundException) throw err;
      throw new TrafficWatchException('Failed to fetch Weather details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
