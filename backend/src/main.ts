import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ========================================
  // CORS 설정
  // ========================================
  app.enableCors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ========================================
  // DTO Validation
  // ========================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ========================================
  // Server
  // ========================================
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
