import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TrafficWatchService {
  async getTrafficDetails(dateTime) {
    try {
      const response = await axios.get(
        `https://api.data.gov.sg/v1/transport/traffic-images?date_time=${encodeURIComponent(
          dateTime,
        )}`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
      return response.data.items;
    } catch (err) {
      console.log(err);
    }
  }
}
