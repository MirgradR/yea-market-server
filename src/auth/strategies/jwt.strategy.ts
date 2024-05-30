import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_KEYS } from '../constants';
import { UserEntityPublic } from 'src/user/types';
import { JwtPayload } from 'jsonwebtoken';
import { GetUserByIdQuery } from 'src/user/queries';

export type TokenPayloadDto = {
  sub: string;
  username: string;
};

export type TokenPayloadExtendedDto = TokenPayloadDto & JwtPayload;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private getUserByIdQuery: GetUserByIdQuery) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_KEYS.ACCESS_SECRET,
    });
  }

  async validate({ sub }: TokenPayloadExtendedDto): Promise<UserEntityPublic> {
    const user = await this.getUserByIdQuery.execute(sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userResult } = user;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return userResult;
  }
}
