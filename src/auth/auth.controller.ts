import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntityPublic } from 'src/user/types';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import { Public } from './decorators/public.decorator';
import {
  LoginApiDocs,
  RefreshApiDocs,
  RegisterUserApiDocs,
} from './decorators/api-docs.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { UserEntity } from 'src/user/user.entity';
import { Response } from 'express';

export type TokenPayloadDto = {
  sub: string;
  username: string;
};

export type TokenPayloadExtendedDto = TokenPayloadDto & JwtPayload;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @RegisterUserApiDocs()
  @Post('register')
  async register(@Body() registrationData: RegistrationUserDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserEntityPublic;
  }> {
    return this.authService.register(registrationData);
  }

  @LoginApiDocs()
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @Request() req: { user: UserEntity },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserEntity;
  }> {
    const tokenPayload: {
      sub: string;
      username: string;
    } = {
      username: req.user.email,
      sub: req.user.id,
    };
    const tokens = await this.authService.signTokens(tokenPayload);
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/auth/refresh',
    });
    return tokens;
  }

  @Public()
  @RefreshApiDocs()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshToken(
    @Request() req: { user: TokenPayloadExtendedDto },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: UserEntity;
  }> {
    const payload: TokenPayloadDto = {
      username: req.user.username,
      sub: req.user.sub,
    };

    const tokens = await this.authService.signTokens(payload);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/auth/refresh',
    });

    return tokens;
  }

  @Patch('logout')
  async logout(
    @Request() req: { user: UserEntityPublic },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.id);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/auth/refresh',
    });
    return { message: 'Вы успешно вышли из системы.' };
  }
}
