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

    this.logger.log(`Generated tokens for user with ID ${payload.id}`);

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
      this.logger.log(`Updating refresh token for user with ID ${userId}`);
      userToken.refreshToken = refreshToken;
      return this.tokensRepository.save(userToken);
    }

    this.logger.log(`Saving refresh token for user with ID ${userId}`);
    const token = this.tokensRepository.create({ refreshToken, userId });
    return this.tokensRepository.save(token);
  }

  validateAccessToken(accessToken: string) {
    try {
      const token = jwt.verify(
        accessToken,
        this.configService.getOrThrow<string>('JWT_CLIENT_ACCESS_SECRET'),
      );

      this.logger.log(`Validated access token`);

      return token as ClientTokenDto;
    } catch (err: any) {
      this.logger.error(`Failed to validate access token: ${err.message}`);
      throw new UnauthorizedException();
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const token = jwt.verify(
        refreshToken,
        this.configService.getOrThrow<string>('JWT_CLIENT_REFRESH_SECRET'),
      );

      this.logger.log(`Validated refresh token`);

      return token as ClientTokenDto;
    } catch (err: any) {
      this.logger.error(`Failed to validate refresh token: ${err.message}`);
      throw new UnauthorizedException('Invalid token!');
    }
  }

  async deleteToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);

    if (!token) {
      throw new NotFoundException('Refresh token not found!');
    }

    this.logger.log(`Deleting refresh token`);
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
      this.logger.error(`Failed to find token: ${err.message}`);
      throw new UnauthorizedException(
        'Token not found! Please register first!',
      );
    }
  }

  generateResetToken(payload: ClientTokenDto) {
    const resetToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_RESET_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>('JWT_RESET_TIME'),
      },
    );

    this.logger.log(`Generated reset token for user with ID ${payload.id}`);

    return resetToken;
  }

  async validateResetToken(resetToken: string) {
    try {
      const token = jwt.verify(
        resetToken,
        this.configService.getOrThrow<string>('JWT_RESET_SECRET'),
      );

      this.logger.log(`Validated reset token`);

      return token as ClientTokenDto;
    } catch (err: any) {
      this.logger.error(`Failed to validate reset token: ${err.message}`);
      throw new UnauthorizedException('Invalid token!');
    }
  }
}
