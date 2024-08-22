import { Module } from '@nestjs/common';
import { NiceController } from './nice.controller';
import { NiceService } from './nice.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [NiceController],
  providers: [NiceService]
})
export class NiceModule {}