import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { validate } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './libs/logger/logger.module';
import { HealthModule } from './utils/health/health.module';
import { MediaModule } from './libs/media/media.module';
import { MinioModule } from './libs/minio/minio.module';
import { AdminTokenModule } from './components/admin/token/token.module';
import { AdminAuthModule } from './components/admin/auth/auth.module';
import { AdminUserCommonModule } from './components/admin/userCommon/userCommon.module';
import { AdminUsersModule } from './components/admin/users/users.module';
import { CategoryModule } from './components/category/category.module';
import { ProductModule } from './components/product/product.module';
import { AllExceptionsFilter } from './utils/core/allException.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ExcludeNullInterceptor } from './common/interceptors/excludeNulls.interceptor';
import { AuthGuard } from './common/guards/auth.guard';
import { LogsMiddleware } from './libs/logger/middleware/logs.middleware';
import { TerminusModule } from '@nestjs/terminus';
import DatabaseLogger from './libs/logger/helpers/databaseLogger';
import { AdminUsersService } from './components/admin/users/users.service';
import { AdminsEntity } from './components/admin/users/entities/admin.entity';
import { ClientUsersCommonModule } from './components/client/usersCommon/usersCommon.module';
import { ClientAuthModule } from './components/client/auth/auth.module';
import { ClientTokenModule } from './components/client/token/token.module';
import { UsersModule } from './components/client/users/users.module';
import { MailsModule } from './components/mails/mails.module';
import { FavoritesModule } from './components/favorites/favorites.module';
import { ProductCommonModule } from './components/productCommon/productCommon.module';
import { ReviewsModule } from './components/reviews/reviews.module';
import { OrdersModule } from './components/orders/orders.module';
import { BasketModule } from './components/basket/basket.module';
import { BlogModule } from './components/blog/blog.module';
import { TagsModule } from './components/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminsEntity]),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      // validate,
      isGlobal: true,
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        entities: ['entity/**/.entity.ts'],
        migrations: ['src/migrations/*.ts'],
        migrationsTableName: 'custom_migration_table',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TerminusModule.forRoot(),
    LoggerModule,
    HealthModule,
    MediaModule,
    MinioModule,
    AdminTokenModule,
    AdminAuthModule,
    AdminUserCommonModule,
    AdminUsersModule,
    CategoryModule,
    ProductModule,
    AdminTokenModule,
    ClientUsersCommonModule,
    ClientAuthModule,
    ClientTokenModule,
    UsersModule,
    MailsModule,
    FavoritesModule,
    ProductCommonModule,
    ReviewsModule,
    OrdersModule,
    BasketModule,
    BlogModule,
    TagsModule,
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
