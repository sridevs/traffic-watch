import { Module } from '@nestjs/common';
import { TrafficWatchController } from './controller/traffic-watch.controller';
import { TrafficWatchService } from './service/traffic-watch.service';
import { APP_FILTER } from '@nestjs/core';
import { NoDataFoundExceptionFilter } from './ExceptionFilter/NoDataFoundException';
import { TrafficWatchExceptionFilter } from './ExceptionFilter/TrafficWatchException';

@Module({
  imports: [],
  controllers: [TrafficWatchController],
  providers: [
    TrafficWatchService,
    {
      provide: APP_FILTER,
      useClass: NoDataFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TrafficWatchExceptionFilter,
    },
  ],
})
export class AppModule {}
