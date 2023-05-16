import { Controller, Get, Query } from '@nestjs/common';
import { TrafficWatchService } from '../service/traffic-watch.service';
import { combineTrafficAndWeather } from '../util/location-util';
import { TrafficWeather } from '../interface/traffic';

@Controller('traffic-watch')
export class TrafficWatchController {
  constructor(private readonly trafficWatchService: TrafficWatchService) {}

  @Get('')
  async getTrafficWeatherInfo(@Query('dateTime') dateTime: string): Promise<TrafficWeather[]> {
    const weatherForecasts = await this.trafficWatchService.getWeatherForecasts(dateTime);
    const trafficCameras = await this.trafficWatchService.getTrafficDetails(dateTime);
    const trafficWeathers = combineTrafficAndWeather(trafficCameras, weatherForecasts);
    console.log(trafficWeathers);
    return trafficWeathers;
  }
}
