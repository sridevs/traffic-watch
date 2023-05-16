import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherForecast } from '../interface/weatherForecast';
import { TrafficCamera } from '../interface/traffic';

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
      return response.data.items[0].cameras;
    } catch (err) {
      console.log(err);
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
    }
  }
}
