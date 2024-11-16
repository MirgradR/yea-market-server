import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { ClientUsersCommonModule } from '../usersCommon/usersCommon.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), ClientUsersCommonModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
