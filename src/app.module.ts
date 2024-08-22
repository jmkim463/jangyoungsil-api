import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NiceModule } from './nice/nice.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NiceModule,
    AuthModule
  ],
  controllers: [AppController],
})
export class AppModule {}
