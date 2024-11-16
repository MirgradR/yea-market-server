import { Module } from '@nestjs/common';
import { UserCommonService } from './userCommon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsEntity } from '../users/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminsEntity])],
  providers: [UserCommonService],
  exports: [UserCommonService],
})
export class AdminUserCommonModule {}
