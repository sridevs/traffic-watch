import { Coordinate, ImageProps } from '../interface/traffic';

export class TrafficCamera {
  private readonly _camera_id: string;
  private readonly _image: string;
  private readonly _image_metadata: ImageProps;
  private readonly _location: Coordinate;
  private readonly _timestamp: string;

  constructor(camera_id: string, image: string, image_metadata: ImageProps, location: Coordinate, timestamp: string) {
    this._camera_id = camera_id;
    this._image = image;
    this._image_metadata = image_metadata;
    this._location = location;
    this._timestamp = timestamp;
  }

  get timestamp(): string {
    return this._timestamp;
  }
  get location(): Coordinate {
    return this._location;
  }
  get image_metadata(): ImageProps {
    return this._image_metadata;
  }
  get image(): string {
    return this._image;
  }
  get camera_id(): string {
    return this._camera_id;
  }
}
