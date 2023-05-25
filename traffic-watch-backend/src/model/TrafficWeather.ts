import { Coordinate, ImageProps } from '../interface/traffic';

export class TrafficWeather {
  camera_id: string;
  image: string;
  image_metadata: ImageProps;
  location: Coordinate;
  locationName: string;
  weatherForecast: string;
  timestamp: string;
  proximity?: number;

  constructor(
    camera_id: string,
    image: string,
    image_metadata: ImageProps,
    location: Coordinate,
    locationName: string,
    weatherForecast: string,
    timestamp: string,
    proximity?: number,
  ) {
    this.camera_id = camera_id;
    this.image = image;
    this.image_metadata = image_metadata;
    this.location = location;
    this.locationName = locationName;
    this.weatherForecast = weatherForecast;
    this.timestamp = timestamp;
    this.proximity = proximity;
  }

  get omitProximity() {
    return new TrafficWeather(
      this.camera_id,
      this.image,
      this.image_metadata,
      this.location,
      this.locationName,
      this.weatherForecast,
      this.timestamp,
    );
  }
}
