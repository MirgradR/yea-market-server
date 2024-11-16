import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyHash } from 'src/helpers/providers/generateHash';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserCommonService } from '../userCommon/userCommon.service';
import { AdminUserLoginResponse } from './responses/userLogin.response';
import { AdminUserRefreshResponse } from './responses/userRefresh.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { AdminTokenService } from '../token/token.service';
import { AdminTokenDto } from '../token/dto/token.dto';

@Injectable()
export class AdminAuthService {
  private logger = new Logger(AdminAuthService.name);
  constructor(
    private readonly userCommonService: UserCommonService,
    private readonly tokenService: AdminTokenService,
  ) {}

  async userLogin(dto: UserLoginDto): Promise<AdminUserLoginResponse> {
    this.logger.log('Попытка входа пользователя...');
    const user = await this.userCommonService.findUserByEmail(dto.email);

    if (!user) {
      this.logger.error(
        `Пользователь с электронной почтой ${dto.email} не найден`,
      );
      throw new NotFoundException(`User with email ${dto.email} not found!`);
    }

    const isPasswordCorrect = await verifyHash(dto.password, user.password);

    if (!isPasswordCorrect) {
      this.logger.error('Неверный пароль');
      throw new BadRequestException('Incorrect password!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new AdminTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log('Успешный вход пользователя');
    return { message: 'User login successful!', user, ...tokens };
  }

  async logoutUser(refreshToken: string): Promise<SuccessMessageType> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    await this.tokenService.deleteToken(refreshToken);

    return { message: 'User logged out' };
  }

  async refreshTokens(refreshToken: string): Promise<AdminUserRefreshResponse> {
    this.logger.log('Попытка обновления токенов...');
    if (!refreshToken) {
      this.logger.error('Не предоставлен обновляющий токен!');
      throw new UnauthorizedException('Refresh token not provided!');
    }

    const tokenFromDB = await this.tokenService.findToken(refreshToken);
    const validToken = this.tokenService.validateRefreshToken(refreshToken);

    if (!validToken || !tokenFromDB) {
      this.logger.error('Неверный токен!');
      throw new UnauthorizedException('Invalid token!');
    }

    const user = await this.userCommonService.findUserById(validToken.id);

    if (!user) {
      this.logger.error('Пользователь не найден!');
      throw new NotFoundException('User not found!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new AdminTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log('Токены успешно обновлены');
    return {
      message: 'Tokens successfully refreshed',
      ...tokens,
      user,
    };
  }
}
