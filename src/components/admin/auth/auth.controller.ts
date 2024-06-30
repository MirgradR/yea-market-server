import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthService } from './auth.service';
import { UserLoginDto } from './dto/userLogin.dto';
import { Cookies } from 'src/common/decorators/getCookie.decorator';
import { AdminUserLoginResponse } from './responses/userLogin.response';
import { UserLoginOperation } from './decorators/userLoginOperation.decorator';
import { UserRefreshOperation } from './decorators/userRefreshOperation.decorator';
import { UserLogoutOperation } from './decorators/userLogout.decorator';
import { AdminUserRefreshResponse } from './responses/userRefresh.response';

@Controller('admin/auth')
@ApiTags('admin-auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @UserLoginOperation()
  @Post('login')
  async userLogin(@Body() dto: UserLoginDto): Promise<AdminUserLoginResponse> {
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
  ): Promise<AdminUserRefreshResponse> {
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
  @Post('logout')
  async logout(@Cookies('refreshToken') refreshToken: string) {
    const { message } = await this.authService.logoutUser(refreshToken);

    return { message };
  }
}
