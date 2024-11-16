import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ClientTokenDto } from './dto/token.dto';
import { ClientTokensEntity } from './entities/token.entity';

@Injectable()
export class ClientTokenService {
  private readonly logger = new Logger(ClientTokenService.name);

  constructor(
    @InjectRepository(ClientTokensEntity)
    private tokensRepository: Repository<ClientTokensEntity>,
    private configService: ConfigService,
  ) {}

  generateTokens(payload: ClientTokenDto) {
    const accessToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_CLIENT_ACCESS_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_CLIENT_ACCESS_TIME',
        ),
      },
    );
    const refreshToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_CLIENT_REFRESH_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_CLIENT_REFRESH_TIME',
        ),
      },
    );

    this.logger.log(`Созданы токены для пользователя с ID ${payload.id}`);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokens(userId: string, refreshToken: string) {
    const userToken = await this.tokensRepository.findOne({
      where: { userId: userId },
    });

    if (userToken) {
      this.logger.log(
        `Обновление refresh токена для пользователя с ID ${userId}`,
      );
      userToken.refreshToken = refreshToken;
      return this.tokensRepository.save(userToken);
    }

    this.logger.log(
      `Сохранение refresh токена для пользователя с ID ${userId}`,
    );
    const token = this.tokensRepository.create({ refreshToken, userId });
    return this.tokensRepository.save(token);
  }

  validateAccessToken(accessToken: string) {
    try {
      const token = jwt.verify(
        accessToken,
        this.configService.getOrThrow<string>('JWT_CLIENT_ACCESS_SECRET'),
      );

      this.logger.log(`Access токен успешно валидирован`);

      return token as ClientTokenDto;
    } catch (err: any) {
      this.logger.error(`Не удалось валидировать access токен: ${err.message}`);
      throw new UnauthorizedException('Invalid access token!');
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const token = jwt.verify(
        refreshToken,
        this.configService.getOrThrow<string>('JWT_CLIENT_REFRESH_SECRET'),
      );

      this.logger.log(`Refresh токен успешно валидирован`);

      return token as ClientTokenDto;
    } catch (err: any) {
      this.logger.error(
        `Не удалось валидировать refresh токен: ${err.message}`,
      );
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }

  async deleteToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);

    if (!token) {
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
      this.logger.error(`Не удалось найти токен: ${err.message}`);
      throw new UnauthorizedException(
        'Token not found! Please register first!',
      );
    }
  }
}
