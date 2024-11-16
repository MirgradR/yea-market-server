import { RedisService } from '../../libs/redis/redis.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { IS_ADMIN_KEY } from '../decorators/isAdmin.decorator';
import { ROLES_KEY } from '../decorators/role.decorator';
import { AdminTokenService } from 'src/components/admin/token/token.service';
import { ClientTokenService } from 'src/components/client/token/token.service';
import { IS_CLIENT_KEY } from '../decorators/isClient.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private adminTokenService: AdminTokenService,
    private clientTokenService: ClientTokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isAdmin = this.reflector.getAllAndOverride(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isClient = this.reflector.getAllAndOverride(IS_CLIENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const role = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      if (isPublic) return true;
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        this.logger.error('User unauthorized');
        throw new UnauthorizedException('User unauthorized');
      }
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        this.logger.error('User unauthorized');
        throw new UnauthorizedException('User unauthorized');
      }

      if (isAdmin) {
        const userToken = this.adminTokenService.validateAccessToken(token);

        if ((role && !role.includes(userToken.role)) || !userToken.role) {
          throw new ForbiddenException(
            `You don't have permissions to do this request`,
          );
        }
        // const tokenInBlackList = await this.redisService.getRedisToken(token);
        // if (tokenInBlackList) {
        //   this.logger.error('Token is invalid');
        //   throw new UnauthorizedException('Token is invalid');
        // }
        req.currentUser = userToken;
      }

      if (isClient) {
        const userToken = this.clientTokenService.validateAccessToken(token);

        // const tokenInBlackList = await this.redisService.getRedisToken(token);
        // if (tokenInBlackList) {
        //   this.logger.error('Token is invalid');
        //   throw new UnauthorizedException('Token is invalid');
        // }
        req.currentUser = userToken;
      }

      // const userToken = this.tokenService.validateAccessToken(token);
      // const tokenInBlackList = await this.redisService.getRedisToken(token);
      // if (tokenInBlackList) {
      //   this.logger.error('Token is invalid');
      //   throw new UnauthorizedException('Token is invalid');
      // }
      // req.currentUser = userToken;
      return true;
    } catch (e) {
      this.logger.error('User unauthorized');
      throw new UnauthorizedException('User unauthorized');
    }
  }
}
