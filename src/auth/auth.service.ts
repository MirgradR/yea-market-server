import { Injectable } from '@nestjs/common';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { UserEntityPublic } from 'src/user/types';
import {
  CreateUserCommand,
  UpdateRefreshTokenCommand,
} from 'src/user/commands';
import { LoginUserDto } from './dto';
import { verify as verifyHash } from 'argon2';
import { GetUserByEmailQuery } from 'src/user/queries';
import { JwtService } from '@nestjs/jwt';
import { JWT_KEYS } from './constants';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private createUserCommand: CreateUserCommand,
    private getUserByEmailQuery: GetUserByEmailQuery,
    private updateRefreshTokenCommand: UpdateRefreshTokenCommand,
    private jwtService: JwtService,
  ) {}

  async register(registrationUserDto: RegistrationUserDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserEntityPublic;
  }> {
    const user = await this.createUserCommand.execute(registrationUserDto);
    const tokens = await this.signTokens({
      sub: user.id,
      username: user.email,
    });

    return { user, ...tokens };
  }

  async logout(userId: string) {
    await this.updateRefreshTokenCommand.execute(userId, null);
  }

  async validateUser(
    email: LoginUserDto['email'],
    password: LoginUserDto['password'],
  ): Promise<UserEntityPublic | null> {
    const user = await this.getUserByEmailQuery.execute(email);

    if (user) {
      const isPassportMatch = await verifyHash(user.passwordHash, password);

      if (isPassportMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...result } = user;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return result;
      }
    }

    return null;
  }

  async signTokens(userToken: { sub: string; username: string }): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserEntity;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(userToken, {
        secret: JWT_KEYS.ACCESS_SECRET,
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(userToken, {
        secret: JWT_KEYS.REFRESH_SECRET,
        expiresIn: '30d',
      }),
    ]);

    const user = await this.updateRefreshTokenCommand.execute(
      userToken.sub,
      refreshToken,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }
}
