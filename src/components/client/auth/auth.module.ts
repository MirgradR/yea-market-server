import { Module } from '@nestjs/common';
import { ClientAuthService } from './auth.service';
import { ClientAuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/user.entity';
import { ClientUsersCommonModule } from '../usersCommon/usersCommon.module';
import { ClientTokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ClientUsersCommonModule,
    ClientTokenModule,
  ],
  controllers: [ClientAuthController],
  providers: [ClientAuthService],
})
export class ClientAuthModule {}
