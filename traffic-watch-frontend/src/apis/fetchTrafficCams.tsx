import axios from "axios";
import { Moment } from "moment";

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
export const fetchTrafficCamData = async (
    BASE_URL: string,
    date: Moment,
    time: Moment
): Promise<TrafficWeather[]> => {
    const trafficWeatherResponse = await axios.get(
        `${BASE_URL}?dateTime=${date.format("YYYY-MM-DD")}T${time.format("HH:mm:ss")}`
    );
    return trafficWeatherResponse.data;
};
