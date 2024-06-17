import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import CustomLogger from './helpers/customLogger';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [LoggerService, CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
