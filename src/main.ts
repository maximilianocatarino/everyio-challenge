import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './application/module/app.module';
import DatabaseErrorFilter from './domain/common/error/filter/database.error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalFilters(new DatabaseErrorFilter());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
