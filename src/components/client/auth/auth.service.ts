import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserLoginResponse } from './responses/userLogin.response';
import { UsersCommonService } from '../usersCommon/usersCommon.service';
import { generateHash, verifyHash } from 'src/helpers/providers/generateHash';
import { ClientTokenDto } from '../token/dto/token.dto';
import { ClientTokenService } from '../token/token.service';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { UserRefreshResponse } from './responses/userRefresh.response';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRegistrationDto } from './dto/userRegistration.dto';
import { UserRegistrationResponse } from './responses/userRegistration.response';

@Injectable()
export class ClientAuthService {
  private logger = new Logger(ClientAuthService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private userCommonService: UsersCommonService,
    private tokenService: ClientTokenService,
  ) {}

  async userRegistration(
    dto: UserRegistrationDto,
  ): Promise<UserRegistrationResponse> {
    const candidate = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (candidate)
      throw new ConflictException(
        `Пользователь с электронной почтой ${dto.email} уже существует`,
      );
    dto.password = await generateHash(dto.password);
    const user = this.userRepository.create(dto);

    await this.userRepository.save(user);

    const tokens = this.tokenService.generateTokens({
      ...new ClientTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log(`Пользователь зарегистрирован: ${dto.email}`);
    return {
      message: 'Пользователь успешно зарегистрирован',
      user,
      ...tokens,
    };
  }

  async userLogin(dto: UserLoginDto): Promise<UserLoginResponse> {
    this.logger.log('Попытка входа пользователя...');
    const user = await this.userCommonService.findUserByEmail(dto.email);

    if (!user) {
      this.logger.error(
        `Пользователь с электронной почтой ${dto.email} не найден`,
      );
      throw new NotFoundException(
        `Пользователь с электронной почтой ${dto.email} не найден!`,
      );
    }

    const isPasswordCorrect = await verifyHash(dto.password, user.password);

    if (!isPasswordCorrect) {
      this.logger.error('Неверный пароль');
      throw new BadRequestException('Неверный пароль!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new ClientTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log(`Успешный вход пользователя: ${dto.email}`);
    return { message: 'Успешный вход пользователя!', user, ...tokens };
  }

  async logoutUser(refreshToken: string): Promise<SuccessMessageType> {
    if (!refreshToken) {
      throw new UnauthorizedException('Не предоставлен обновляющий токен');
    }

    await this.tokenService.deleteToken(refreshToken);

    this.logger.log('Пользователь разлогинен');
    return { message: 'Пользователь разлогинен' };
  }

  async refreshTokens(refreshToken: string): Promise<UserRefreshResponse> {
    this.logger.log('Попытка обновления токенов...');
    if (!refreshToken) {
      this.logger.error('Не предоставлен обновляющий токен!');
      throw new UnauthorizedException('Не предоставлен обновляющий токен!');
    }

    const tokenFromDB = await this.tokenService.findToken(refreshToken);
    const validToken = this.tokenService.validateRefreshToken(refreshToken);

    if (!validToken || !tokenFromDB) {
      this.logger.error('Неверный токен!');
      throw new UnauthorizedException('Неверный токен!');
    }

    const user = await this.userCommonService.findUserById(validToken.id);

    if (!user) {
      this.logger.error('Пользователь не найден!');
      throw new NotFoundException('Пользователь не найден!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new ClientTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log(`Токены успешно обновлены для пользователя: ${user.email}`);
    return {
      message: 'Токены успешно обновлены',
      ...tokens,
      user,
    };
  }
}
