import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const errorId = uuidv4();
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpError = exception instanceof HttpException;

    const message = httpError ? exception.message : 'Erro interno do servidor';

    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    const responseBody = {
      errorId,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path,
      message,
    };

    const debugData = {
      exception,
      trace: exception.stack,
      message: exception.message,
    };

    if (httpError) {
      this.logWarnJSON({ httpError: { ...responseBody, ...debugData } });
    } else {
      this.logErrorJSON({ internalError: { ...responseBody, ...debugData } });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  logWarnJSON(data: any) {
    return this.logger.warn(data);
  }

  logErrorJSON(data: any) {
    return this.logger.error(data);
  }
}
