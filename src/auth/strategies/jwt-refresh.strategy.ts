import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { TokenPayloadExtendedDto } from '../auth.controller';
import { JWT_KEYS } from '../constants';
import { Request } from 'express';
import { GetUserByIdQuery } from 'src/user/queries';
import { verify as verifyHash } from 'argon2';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private getUserByIdlQuery: GetUserByIdQuery) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_KEYS.REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    userToken: TokenPayloadExtendedDto,
  ): Promise<
    TokenPayloadExtendedDto & { refreshToken: UserEntity['refreshToken'] }
  > {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const user = await this.getUserByIdlQuery.execute(userToken.sub);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const isTokenMatch = await verifyHash(user.refreshToken, refreshToken);
    if (!isTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    return { ...userToken, refreshToken };
  }
}
