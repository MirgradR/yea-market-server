import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthService } from './auth.service';
import { UserLoginDto } from './dto/userLogin.dto';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { UserLoginResponse } from './responses/userLogin.response';
import { UserLoginOperation } from './decorators/userLoginOperation.decorator';
import { UserRefreshOperation } from './decorators/userRefreshOperation.decorator';
import { UserLogoutOperation } from './decorators/userLogout.decorator';
import { UserRefreshResponse } from './responses/userRefresh.response';

@Controller('admin/auth')
@ApiTags('admin-auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}
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
