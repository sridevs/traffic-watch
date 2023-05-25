import { Coordinate, TrafficCamera, TrafficWeather, TrafficWeatherWithProximity } from '../interface/traffic';
import { WeatherForecast } from '../interface/weatherForecast';

export function combineTrafficAndWeather(
  trafficCameras: TrafficCamera[],
  weatherForecasts: WeatherForecast[],
): TrafficWeather[] {
  const trafficWeatherWithProximities: TrafficWeatherWithProximity[] = [];

  for (const camera of trafficCameras) {
    const { image_metadata, image, camera_id, location, timestamp } = camera;
    const { forecast: closestForecast, distance: shortestDistance } = weatherForecasts.reduce(
      (closest, forecast) => {
        const distance = calculateDistance(location, forecast.coordinate);
        return distance < closest.distance ? { forecast, distance } : closest;
      },
      { forecast: undefined, distance: Infinity },
    );

    if (closestForecast) {
      // Check if a TrafficWeather object with the same location already exists
      const existingWeatherIndex = trafficWeatherWithProximities.findIndex(
        (weather) => weather.locationName === closestForecast.location,
      );
      const existingWeather = trafficWeatherWithProximities[existingWeatherIndex];

      const trafficWeatherWithProximity: TrafficWeatherWithProximity = {
        camera_id: camera_id,
        image: image,
        image_metadata: image_metadata,
        location: location,
        locationName: closestForecast.location,
        weatherForecast: closestForecast.forecast,
        timestamp: timestamp,
        proximity: shortestDistance,
      };

      if (!existingWeather) {
        trafficWeatherWithProximities.push(trafficWeatherWithProximity);
      } else if (shortestDistance < existingWeather.proximity)
        trafficWeatherWithProximities[existingWeatherIndex] = trafficWeatherWithProximity;
    }
  }

  return trafficWeatherWithProximities.map((trafficWeatherProximity) => {
    const { proximity, ...trafficWeather } = trafficWeatherProximity;
    return trafficWeather;
  });
}

function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const latDiff = coord1.latitude - coord2.latitude;
  const lonDiff = coord1.longitude - coord2.longitude;
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}
