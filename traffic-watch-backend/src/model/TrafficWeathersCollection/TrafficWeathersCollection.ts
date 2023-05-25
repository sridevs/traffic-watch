import { TrafficCamera } from '../TrafficCamera';
import { TrafficWeather } from '../TrafficWeather';
import { WeatherForecast } from '../WeatherForecast/WeatherForecast';

export class TrafficWeathersCollection {
  private readonly trafficWeathers: TrafficWeather[];

  constructor() {
    this.trafficWeathers = [];
  }

  public combineTrafficAndWeather(
    trafficCameras: TrafficCamera[],
    weatherForecasts: WeatherForecast[],
  ): TrafficWeather[] {
    for (const camera of trafficCameras) {
      const { image_metadata, image, camera_id, location, timestamp } = camera;
      const { forecast: closestForecast, distance: shortestDistance } = weatherForecasts.reduce(
        (closest, forecast) => forecast.getClosestForecast(location, closest),
        { forecast: undefined, distance: Infinity },
      );

      if (closestForecast) {
        const existingWeatherIndex = this.trafficWeathers.findIndex(
          (weather) => weather.locationName === closestForecast.location,
        );
        const existingWeather = this.trafficWeathers[existingWeatherIndex];

        const trafficWeather: TrafficWeather = new TrafficWeather(
          camera_id,
          image,
          image_metadata,
          location,
          closestForecast.location,
          closestForecast.forecast,
          timestamp,
          shortestDistance,
        );

        if (!existingWeather) {
          this.trafficWeathers.push(trafficWeather);
        } else if (shortestDistance < existingWeather.proximity) {
          this.trafficWeathers[existingWeatherIndex] = trafficWeather;
        }
      }
    }
    return this.trafficWeathers.map((trafficWeather) => trafficWeather.omitProximity);
  }
}
