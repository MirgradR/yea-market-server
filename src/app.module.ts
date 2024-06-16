import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/core/allException.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from './libs/redis/redis.module';
import { MinioModule } from './libs/minio/minio.module';
import { validate } from './config/env.validation';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { PrismaModule } from './utils/prisma/prisma.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AuthGuard } from './common/guards/auth.guard';
import { ExcludeNullInterceptor } from './common/interceptors/excludeNulls.interceptor';
import { HealthModule } from './utils/health/health.module';
import { LoggerModule } from './libs/logger/logger.module';
import { LogsMiddleware } from './libs/logger/middleware/logs.middleware';
import { MediaModule } from './libs/media/media.module';
import { AdminTokenModule } from './components/admin/token/token.module';
import { AdminUserCommonModule } from './components/admin/userCommon/userCommon.module';
import { AdminAuthModule } from './components/admin/auth/auth.module';
import { AdminUsersService } from './components/admin/users/users.service';
import { CategoryModule } from './components/category/category.module';
import { ProductModule } from './components/product/product.module';
import { AdminUsersModule } from './components/admin/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validate,
      isGlobal: true,
      cache: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: 'redis',
        ttl: 60,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
        no_ready_check: true,
      }),
    }),
    TerminusModule.forRoot(),
    LoggerModule,
    HealthModule,
    MediaModule,
    MinioModule,
    RedisModule,
    PrismaModule,
    AdminTokenModule,
    AdminAuthModule,
    AdminUserCommonModule,
    AdminUsersModule,
    CategoryModule,
    ProductModule,
    AdminTokenModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludeNullInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AdminUsersService,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private adminUserService: AdminUsersService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
  async onModuleInit() {
    await this.adminUserService.checkDefaultAdminUser();
  }
}
