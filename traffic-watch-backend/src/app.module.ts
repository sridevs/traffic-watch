import { Module } from '@nestjs/common';
import { TrafficWatchController } from './controller/traffic-watch.controller';
import { TrafficWatchService } from './service/traffic-watch.service';

@Module({
  imports: [],
  controllers: [TrafficWatchController],
  providers: [TrafficWatchService],
})
export class AppModule {}
