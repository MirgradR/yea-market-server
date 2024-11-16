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
        `User with email ${dto.email} already exists`,
      );
    dto.password = await generateHash(dto.password);
    const user = this.userRepository.create(dto);

    await this.userRepository.save(user);

    const tokens = this.tokenService.generateTokens({
      ...new ClientTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log(`User registered: ${dto.email}`);
    return {
      message: 'User registered successfully',
      user,
      ...tokens,
    };
  }

  async userLogin(dto: UserLoginDto): Promise<UserLoginResponse> {
    this.logger.log('User login attempt...');
    const user = await this.userCommonService.findUserByEmail(dto.email);

    if (!user) {
      this.logger.error(`User with email ${dto.email} not found`);
      throw new NotFoundException(`User with email ${dto.email} not found!`);
    }

    const isPasswordCorrect = await verifyHash(dto.password, user.password);

    if (!isPasswordCorrect) {
      this.logger.error('Incorrect password');
      throw new BadRequestException('Incorrect password!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new ClientTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log(`User logged in successfully: ${dto.email}`);
    return { message: 'User logged in successfully!', user, ...tokens };
  }

  async logoutUser(refreshToken: string): Promise<SuccessMessageType> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    await this.tokenService.deleteToken(refreshToken);

    this.logger.log('User logged out');
    return { message: 'User logged out' };
  }

  async refreshTokens(refreshToken: string): Promise<UserRefreshResponse> {
    this.logger.log('Attempting to refresh tokens...');
    if (!refreshToken) {
      this.logger.error('Refresh token not provided!');
      throw new UnauthorizedException('Refresh token not provided!');
    }

    const tokenFromDB = await this.tokenService.findToken(refreshToken);
    const validToken = this.tokenService.validateRefreshToken(refreshToken);

    if (!validToken || !tokenFromDB) {
      this.logger.error('Invalid token!');
      throw new UnauthorizedException('Invalid token!');
    }

    const user = await this.userCommonService.findUserById(validToken.id);

    if (!user) {
      this.logger.error('User not found!');
      throw new NotFoundException('User not found!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new ClientTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log(`Tokens refreshed successfully for user: ${user.email}`);
    return {
      message: 'Tokens refreshed successfully',
      ...tokens,
      user,
    };
  }
}
