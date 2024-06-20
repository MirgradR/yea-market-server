import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { AdminUserCommonModule } from '../userCommon/userCommon.module';
import { AdminTokenModule } from '../token/token.module';

@Module({
  imports: [
    AdminUserCommonModule,
    AdminTokenModule,
    // ThrottlerModule.forRoot({
    //   throttlers: [{ limit: 5, ttl: seconds(60 * 10) }],
    //   storage: new ThrottlerStorageRedisService(),
    // }),
    // RedisModule,
  ],
  providers: [AdminAuthService],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
