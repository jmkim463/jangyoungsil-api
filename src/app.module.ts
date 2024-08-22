import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TimetableModule } from './timetable/timetable.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TimetableModule
  ],
  controllers: [AppController],
})
export class AppModule {}
