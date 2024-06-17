import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { AdminTokenModule } from '../token/token.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from 'src/libs/redis/redis.module';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { AdminUserCommonModule } from '../userCommon/userCommon.module';

@Module({
  imports: [
    AdminUserCommonModule,
    AdminTokenModule,
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 5, ttl: seconds(60 * 10) }],
      storage: new ThrottlerStorageRedisService(),
    }),
    RedisModule,
  ],
  providers: [AdminAuthService, ThrottlerGuard],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
