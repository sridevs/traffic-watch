import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';

export class TrafficWatchException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

@Injectable()
export class TrafficWatchExceptionFilter implements ExceptionFilter {
  catch(exception: TrafficWatchException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = exception.getStatus();
    const { message } = exception;

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
