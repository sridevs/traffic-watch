import { Coordinate, TrafficCamera, TrafficWeather } from '../interface/traffic';
import { WeatherForecast } from '../interface/weatherForecast';

export function combineTrafficAndWeather(
  trafficCameras: TrafficCamera[],
  weatherForecasts: WeatherForecast[],
): TrafficWeather[] {
  const trafficWeatherList: TrafficWeather[] = [];

  for (const camera of trafficCameras) {
    let closestForecast: WeatherForecast | undefined;
    let shortestDistance = Infinity;

    const { image_metadata, image, camera_id, location, timestamp } = camera;
    for (const forecast of weatherForecasts) {
      const distance = calculateDistance(location, forecast.coordinate);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestForecast = forecast;
      }
    }

    if (closestForecast) {
      // Check if a TrafficWeather object with the same location already exists
      const existingWeather = trafficWeatherList.find((weather) => weather.locationName === closestForecast.location);

      if (existingWeather) {
        // Compare the distances and update the existing TrafficWeather object
        const existingDistance = calculateDistance(location, existingWeather.location);

        if (shortestDistance < existingDistance) {
          existingWeather.camera_id = camera_id;
          existingWeather.image = image;
          existingWeather.image_metadata = image_metadata;
          existingWeather.timestamp = timestamp;
          existingWeather.weatherForecast = closestForecast.forecast;
        }
      } else {
        // Create a new TrafficWeather object
        const trafficWeather: TrafficWeather = {
          camera_id: camera_id,
          image: image,
          image_metadata: image_metadata,
          location: location,
          locationName: closestForecast.location,
          weatherForecast: closestForecast.forecast,
          timestamp: timestamp,
        };

        trafficWeatherList.push(trafficWeather);
      }
    }
  }

  return trafficWeatherList;
}

function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const latDiff = coord1.latitude - coord2.latitude;
  const lonDiff = coord1.longitude - coord2.longitude;
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}
