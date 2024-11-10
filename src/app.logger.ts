import dayjs from 'dayjs';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import Winston from 'winston';
import 'winston-daily-rotate-file';

const MAX_SIZE_LOGGER = '1g';
const DATE_PATTERN = 'YYYY-MM-DD';

interface ConfigWinstonLogFile {
  level: 'warn' | 'error';
  filename: string;
}

export class AppLogger {
  constructor(private isProduction: boolean) {}

  static create(isProduction: boolean) {
    return new AppLogger(isProduction);
  }

  config() {
    const debugTransporters = !this.isProduction
      ? [this.configDebugLogger()]
      : [];

    return WinstonModule.createLogger({
      transports: [
        this.configErrorLogger(),
        this.configConsoleLogger(),
        ...debugTransporters,
      ],
    });
  }

  configConsoleLogger() {
    return new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
          colors: true,
          prettyPrint: true,
          processId: true,
          appName: true,
        }),
      ),
    });
  }

  configDebugLogger() {
    return this.configLogFile({
      level: 'warn',
      filename: process.env.WINSTON_DEBUG_FILENAME!,
    });
  }

  configErrorLogger() {
    return this.configLogFile({
      level: 'error',
      filename: process.env.WINSTON_ERROR_FILENAME!,
    });
  }

  configLogFile({ level, filename }: ConfigWinstonLogFile) {
    return new Winston.transports.DailyRotateFile({
      level,
      maxSize: MAX_SIZE_LOGGER,
      filename: this.formatLogFilename(filename!),
      zippedArchive: true,
      datePattern: DATE_PATTERN,
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.ms(),
        Winston.format.json(),
      ),
    });
  }

  getCurrentTimestamp() {
    return dayjs().format(DATE_PATTERN);
  }

  formatLogFilename(filename: string) {
    return `${filename}-%DATE%.log`;
  }
}
