import { applyDecorators, HttpCode, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { AdminUserLoginResponse } from '../responses/userLogin.response';
import { UserLoginDto } from '../dto/userLogin.dto';

export function UserLoginOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: UserLoginDto }),
    ApiOkResponse({
      description: 'User login successful!',
      type: AdminUserLoginResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid password!' }),
    ApiNotFoundResponse({ description: 'User with email not found!' }),
    Public(),
    UseInterceptors(
      SetCookieInterceptor,
      new TransformDataInterceptor(AdminUserLoginResponse),
    ),
    HttpCode(200),
  );
}
