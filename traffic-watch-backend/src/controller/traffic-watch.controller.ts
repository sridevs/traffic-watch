import { BadRequestException, Controller, Get, Query, UseFilters } from '@nestjs/common';
import { TrafficWatchService } from '../service/traffic-watch.service';
import { TrafficWeather } from '../interface/traffic';
import { TrafficWeathersCollection } from '../model/TrafficWeathersCollection/TrafficWeathersCollection';
import { NoDataFoundExceptionFilter } from '../ExceptionFilter/NoDataFoundException';
import { TrafficWatchExceptionFilter } from '../ExceptionFilter/TrafficWatchException';

@Controller('traffic-watch')
export class TrafficWatchController {
  constructor(private readonly trafficWatchService: TrafficWatchService) {}

  @Get('')
  @UseFilters(NoDataFoundExceptionFilter, TrafficWatchExceptionFilter)
  async getTrafficWeatherInfo(@Query('dateTime') dateTime: string): Promise<TrafficWeather[]> {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    const isValidDateTime = dateTimeRegex.test(dateTime);
    if (!isValidDateTime) {
      throw new BadRequestException('Invalid dateTime format. Expected format: YYYY-MM-DD[T]HH:mm:ss');
    }
    const weatherForecasts = await this.trafficWatchService.getWeatherForecasts(dateTime);
    const trafficCameras = await this.trafficWatchService.getTrafficDetails(dateTime);
    const trafficWeathersCollection = new TrafficWeathersCollection();
    return trafficWeathersCollection.combineTrafficAndWeather(trafficCameras, weatherForecasts);
  }
}
