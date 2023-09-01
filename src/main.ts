import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Put, ValidationPipe } from '@nestjs/common';
import express from 'express';
import { join } from 'path';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:4200'] });

  app.use(cors({origin:"*"}))
  app.useGlobalPipes(new ValidationPipe)
  app.setGlobalPrefix('api/v1/')
  
 
  // app.use('/public', express.static(join(__dirname, '..', 'public')));
  await app.listen(3000);
}
bootstrap();
