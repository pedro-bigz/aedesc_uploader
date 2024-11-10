import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common';
import { AppLogger } from './app.logger';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: AppLogger.create(true).config(),
  });

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost), app.get(Logger)),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
