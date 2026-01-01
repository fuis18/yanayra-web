// main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrinterModule } from './printer/printer.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    PrinterModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  await app.listen(4000, '0.0.0.0');
}
bootstrap();
