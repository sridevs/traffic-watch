import { Controller, Get, Query } from "@nestjs/common";
import { TrafficWatchService } from "../service/traffic-watch.service";

@Controller('traffic-watch')
export class TrafficWatchController {
  constructor(private readonly trafficWatchService: TrafficWatchService) {}

  @Get('')
  getTrafficDetails(@Query('dateTime') dateTime: string) {
    return this.trafficWatchService.getTrafficDetails(dateTime);
  }
}