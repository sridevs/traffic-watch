import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherForecast } from '../model/WeatherForecast/WeatherForecast';
import { TrafficCamera } from '../model/TrafficCamera';
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
      if (
        !response.data ||
        !response.data.items ||
        !response.data.items.length ||
        Object.keys(response.data.items[0]).length === 0
      ) {
        throw new NoDataFoundException('No traffic data found', HttpStatus.NOT_FOUND);
      }
      return response.data.items[0].cameras.map(
        ({ camera_id, image, image_metadata, location, timestamp }) =>
          new TrafficCamera(camera_id, image, image_metadata, location, timestamp),
      );
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
      if (!response.data) throw new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);

      const { area_metadata, items } = response.data;

      if (!area_metadata || !items || !items.length || Object.keys(items[0]).length === 0)
        throw new NoDataFoundException('No Weather data found', HttpStatus.NOT_FOUND);
      const forecastsLocationMap = {};
      for (const forecast of items[0].forecasts) {
        forecastsLocationMap[forecast.area] = forecast.forecast;
      }

      return area_metadata.map(
        ({ label_location, name }) => new WeatherForecast(name, label_location, forecastsLocationMap[name]),
      );
    } catch (err) {
      console.log(err);
      if (err instanceof NoDataFoundException) throw err;
      throw new TrafficWatchException('Failed to fetch Weather details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
