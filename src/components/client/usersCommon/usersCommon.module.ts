import { Module } from '@nestjs/common';
import { UsersCommonService } from './usersCommon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersCommonService],
  exports: [UsersCommonService],
})
export class ClientUsersCommonModule {}
