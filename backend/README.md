# Config - Nest

## Start

```sh
npm new nest
```

## For fastify

```sh
npm install @nestjs/platform-fastify fastify
```
## For gRPC

```sh
npm install @nestjs/microservices @grpc/grpc-js @grpc/proto-loader
```

```ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
```

## Crear recurso para gRPC

```sh
nest g module printer
nest g service printer --no-spec
nest g controller printer --no-spec
```