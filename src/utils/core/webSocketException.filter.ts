import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

interface CustomWsExceptionResponse {
  statusCode: number;
  message: string;
  event?: string;
  timeStamp: Date;
}

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger('WebSocket-exception');

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const data = ctx.getData();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof WsException) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = exception.message;
    } else {
      errorMessage =
        exception instanceof Error
          ? exception.message
          : 'Internal server error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errorResponse = this.getErrorResponse(
      status,
      errorMessage,
      data?.event,
    );
    this.getErrorLog(errorResponse, data);

    client.emit('error', errorResponse);
  }

  private getErrorResponse(
    status: HttpStatus,
    errorMessage: string,
    event?: string,
  ): CustomWsExceptionResponse {
    return {
      statusCode: status,
      message: errorMessage,
      event: event,
      timeStamp: new Date(),
    };
  }

  private getErrorLog(
    errorResponse: CustomWsExceptionResponse,
    data: any,
  ): void {
    const { statusCode, message } = errorResponse;
    this.logger.error(message, [
      `Event: ${data?.event}`,
      `StatusCode: ${statusCode}`,
      `Payload: ${JSON.stringify(data?.payload)}`,
    ]);
  }
}
