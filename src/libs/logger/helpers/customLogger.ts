import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
} from '@nestjs/common';
import { LoggerService } from '../logger.service';
import { ConfigService } from '@nestjs/config';
import getLogLevels from './getLog';

@Injectable()
class CustomLogger extends ConsoleLogger {
  private readonly logService: LoggerService;
  private readonly configService: ConfigService;
  private notLogHttpUrls: string[];
  private notSaveInDBContexts: string[];
  private notLogContexts: string[];

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    logService: LoggerService,
  ) {
    const environment = configService.get('environment');

    super(context, {
      ...options,
      logLevels: getLogLevels(
        environment === 'production' || environment === 'development',
      ),
    });

    this.configService = configService;
    this.logService = logService;
    this.notLogHttpUrls = configService.get('NOT_LOG_HTTP_URLS');

    this.notSaveInDBContexts = this.configService.get(
      'NOT_SAVE_IN_DB_CONTEXTS',
    );

    this.notLogContexts = this.configService.get('NOT_LOG_CONTEXTS');
  }

  async log(message: string, ...optionalParams: any[]) {
    let context: string;
    let host: string;
    let url: string;
    let statusCode: number;
    let method: string;
    let user: string;
    let nextLoggerMessage: string;
    let time: string;

    if (optionalParams.length === 1) {
      context = optionalParams[0];
    } else {
      [
        [host, url, statusCode, method, user, nextLoggerMessage, time],
        context,
      ] = optionalParams;
    }

    if (this.notLogContexts.includes(context)) {
      return;
    }

    if (url && this.notLogHttpUrls.includes(url)) {
      return;
    }

    super.log.apply(this, [
      nextLoggerMessage || message,
      context || optionalParams[optionalParams.length - 1],
    ]);

    if (this.notSaveInDBContexts.includes(context)) {
      return;
    }

    await this.logService.createLog({
      host,
      url,
      statusCode,
      method,
      user,
      message,
      context: context || optionalParams[optionalParams.length - 1],
      level: 'log',
      time,
    });
  }

  async error(message: string, ...optionalParams: any[]) {
    const context = optionalParams.pop();

    if (this.notLogContexts.includes(context)) {
      return;
    }

    const [host, url, statusCode, method, user] = optionalParams[0] || [];

    if (url && this.notLogHttpUrls.includes(url)) {
      return;
    }

    super.error.apply(this, [message, context]);
    super.log.apply(this, [message, context]);

    if (this.notSaveInDBContexts.includes(context)) {
      return;
    }

    await this.logService.createLog({
      host,
      url,
      statusCode,
      method,
      user,
      message,
      context,
      level: 'error',
    });
  }

  async warn(message: string, context: string) {
    if (this.notLogContexts.includes(context)) {
      return;
    }

    super.warn.apply(this, [message, context]);

    if (this.notSaveInDBContexts.includes(context)) {
      return;
    }

    super.log.apply(this, [message, context]);
    await this.logService.createLog({
      message,
      context,
      level: 'log',
    });

    await this.logService.createLog({
      message,
      context,
      level: 'warn',
    });
  }

  async debug(message: string, context: string) {
    if (this.notLogContexts.includes(context)) {
      return;
    }

    super.debug.apply(this, [message, context]);

    if (this.notSaveInDBContexts.includes(context)) {
      return;
    }

    super.log.apply(this, [message, context]);
    await this.logService.createLog({
      message,
      context,
      level: 'log',
    });

    if (this.configService.get('environment') === 'development') {
      await this.logService.createLog({
        message,
        context,
        level: 'debug',
      });
    }
  }

  async verbose(message: string, context: string) {
    if (this.notLogContexts.includes(context)) {
      return;
    }

    super.log.apply(this, [message, context]);

    if (this.notSaveInDBContexts.includes(context)) {
      return;
    }

    await this.logService.createLog({
      message,
      context,
      level: 'log',
    });

    if (this.configService.get('environment') === 'development') {
      await this.logService.createLog({
        message,
        context,
        level: 'verbose',
      });
    }
  }
}

export default CustomLogger;
