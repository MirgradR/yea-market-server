import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { USERS_COMMANDS } from './commands';
import { USERS_QUERIES } from './queries';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [UserService, ...USERS_COMMANDS, ...USERS_QUERIES],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
