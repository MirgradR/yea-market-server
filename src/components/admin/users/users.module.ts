import { Module } from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { AdminUsersController } from './users.controller';
import { AdminUserCommonModule } from '../userCommon/userCommon.module';
import { MediaModule } from 'src/libs/media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsEntity } from './entities/admin.entity';

@Module({
  imports: [
    AdminUserCommonModule,
    MediaModule,
    TypeOrmModule.forFeature([AdminsEntity]),
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
