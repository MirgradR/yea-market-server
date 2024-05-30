import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { USERS_COMMANDS } from 'src/user/commands';
import { USERS_QUERIES } from 'src/user/queries';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserController } from 'src/user/user.controller';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    ...USERS_COMMANDS,
    ...USERS_QUERIES,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    UserService,
  ],
  controllers: [UserController, AuthController],
  exports: [TypeOrmModule, AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
