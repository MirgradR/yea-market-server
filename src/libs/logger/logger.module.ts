import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import CustomLogger from './helpers/customLogger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsEntity } from './entity/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogsEntity])],
  providers: [LoggerService, CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
