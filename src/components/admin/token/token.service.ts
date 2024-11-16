import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AdminTokenDto } from './dto/token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AdminTokensEntity } from './entities/tokens.entity';

@Injectable()
export class AdminTokenService {
  private readonly logger = new Logger(AdminTokenService.name);

  constructor(
    @InjectRepository(AdminTokensEntity)
    private tokensRepository: Repository<AdminTokensEntity>,
    private configService: ConfigService,
  ) {}

  generateTokens(payload: AdminTokenDto) {
    const accessToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_ADMIN_ACCESS_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ADMIN_ACCESS_TIME',
        ),
      },
    );
    const refreshToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_ADMIN_REFRESH_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ADMIN_REFRESH_TIME',
        ),
      },
    );

    this.logger.log(`Созданы токены для пользователя с ID ${payload.id}`);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokens(adminId: string, refreshToken: string) {
    const userToken = await this.tokensRepository.findOne({
      where: { adminId: adminId },
    });

    if (userToken) {
      this.logger.log(
        `Обновление refresh токена для пользователя с ID ${adminId}`,
      );
      userToken.refreshToken = refreshToken;
      return this.tokensRepository.save(userToken);
    }

    this.logger.log(
      `Сохранение refresh токена для пользователя с ID ${adminId}`,
    );
    const token = this.tokensRepository.create({ refreshToken, adminId });
    return this.tokensRepository.save(token);
  }

  validateAccessToken(accessToken: string) {
    try {
      const token = jwt.verify(
        accessToken,
        this.configService.getOrThrow<string>('JWT_ADMIN_ACCESS_SECRET'),
      );

      this.logger.log(`Access токен подтвержден`);

      return token as AdminTokenDto;
    } catch (err: any) {
      this.logger.error(`Ошибка подтверждения access токена: ${err.message}`);
      throw new UnauthorizedException();
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const token = jwt.verify(
        refreshToken,
        this.configService.getOrThrow<string>('JWT_ADMIN_REFRESH_SECRET'),
      );

      this.logger.log(`Refresh токен подтвержден`);

      return token as AdminTokenDto;
    } catch (err: any) {
      this.logger.error(`Ошибка подтверждения refresh токена: ${err.message}`);
      throw new UnauthorizedException('Invalid token!');
    }
  }

  async deleteToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);

    if (!token) {
      this.logger.log(`Refresh токен не найден`);
      throw new NotFoundException('Refresh token not found!');
    }

    this.logger.log(`Удаление refresh токена`);
    await this.tokensRepository.delete({ id: token.id });
    return { message: 'Token deleted successfully.' };
  }

  async findToken(refreshToken: string) {
    try {
      const token = await this.tokensRepository.findOne({
        where: { refreshToken: refreshToken },
      });
      return token;
    } catch (err: any) {
      this.logger.error(`Ошибка поиска токена: ${err.message}`);
      throw new UnauthorizedException(
        'Token not found! Please register first!',
      );
    }
  }

  generateResetToken(payload: AdminTokenDto) {
    const resetToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_ADMIN_RESET_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ADMIN_RESET_TIME',
        ),
      },
    );

    this.logger.log(`Создан reset токен для пользователя с ID ${payload.id}`);

    return resetToken;
  }

  async validateResetToken(resetToken: string) {
    try {
      const token = jwt.verify(
        resetToken,
        this.configService.getOrThrow<string>('JWT_ADMIN_RESET_SECRET'),
      );

      this.logger.log(`Reset токен подтвержден`);

      return token as AdminTokenDto;
    } catch (err: any) {
      this.logger.error(`Ошибка подтверждения reset токена: ${err.message}`);
      throw new UnauthorizedException('Invalid token!');
    }
  }
}
