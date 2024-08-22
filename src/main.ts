import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204,
    exposedHeaders: ['Authorization', 'access_token', 'refresh_token'],
    allowedHeaders: ['Content-Type', 'authorization', 'Authorization', 'access_token', 'refresh_token'],
  });

  await app.listen(3000);
}

bootstrap();
