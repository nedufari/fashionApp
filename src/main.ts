import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe)
  app.setGlobalPrefix('api/v1/')
  // app.use('/public', express.static(join(__dirname, '..', 'public')));
  await app.listen(3000);
}
bootstrap();
