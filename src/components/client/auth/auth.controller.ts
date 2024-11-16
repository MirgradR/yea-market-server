import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ClientAuthService } from './auth.service';
import { UserLoginOperation } from './decorators/userLoginOperation.decorator';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserLoginResponse } from './responses/userLogin.response';
import { UserRefreshOperation } from './decorators/userRefreshOperation.decorator';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { UserRefreshResponse } from './responses/userRefresh.response';
import { UserLogoutOperation } from './decorators/userLogout.decorator';
import { UserRegistrationOperation } from './decorators/userRegistrationOperation.decorator';
import { UserRegistrationDto } from './dto/userRegistration.dto';
import { UserRegistrationResponse } from './responses/userRegistration.response';
import { ApiTags } from '@nestjs/swagger';

@Controller('client/auth')
@ApiTags('client/auth')
export class ClientAuthController {
  constructor(private readonly authService: ClientAuthService) {}

  @UserRegistrationOperation()
  @Post('registration')
  async userRegistration(
    @Body() dto: UserRegistrationDto,
  ): Promise<UserRegistrationResponse> {
    const { message, user, accessToken, refreshToken } =
      await this.authService.userRegistration(dto);
    return {
      message,
      user,
      accessToken,
      refreshToken,
    };
  }

  @UserLoginOperation()
  @HttpCode(200)
  @Post('login')
  async userLogin(@Body() dto: UserLoginDto): Promise<UserLoginResponse> {
    const { message, user, accessToken, refreshToken } =
      await this.authService.userLogin(dto);
    return {
      message,
      user,
      accessToken,
      refreshToken,
    };
  }

  @UserRefreshOperation()
  @Get('refresh')
  async refresh(
    @Cookies('refreshToken') requestRefreshToken: string,
  ): Promise<UserRefreshResponse> {
    const { message, user, accessToken, refreshToken } =
      await this.authService.refreshTokens(requestRefreshToken);

    return {
      message,
      user,
      accessToken,
      refreshToken,
    };
  }

  @UserLogoutOperation()
  @HttpCode(200)
  @Post('logout')
  async logout(@Cookies('refreshToken') refreshToken: string) {
    const { message } = await this.authService.logoutUser(refreshToken);

    return { message };
  }
}
