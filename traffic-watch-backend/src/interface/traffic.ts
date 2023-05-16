export interface TrafficCamera {
  camera_id: string;
  image: string;
  image_metadata: ImageProps;
  location: Coordinate;
  timestamp: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ImageProps {
  height: number;
  width: number;
  md5: string;
}

export interface TrafficWeather {
  image: string;
  image_metadata: ImageProps;
  location: Coordinate;
  locationName: string;
  weatherForecast: string;
  camera_id: string;
  timestamp: string;
}
