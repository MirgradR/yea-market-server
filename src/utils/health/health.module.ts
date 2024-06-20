import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { TerminusLogger } from './terminus.logger';
// import { RedisModule } from '../../libs/redis/redis.module';
import { HealthService } from './health.service';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: TerminusLogger,
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 1000,
    }),
    HttpModule,
    // RedisModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
