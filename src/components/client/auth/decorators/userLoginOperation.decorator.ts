import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserLoginResponse } from '../responses/userLogin.response';
import { UserLoginDto } from '../dto/userLogin.dto';

export function UserLoginOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: UserLoginDto }),
    ApiResponse({
      status: 200,
      description: 'User login successful!',
      type: UserLoginResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid password!' }),
    ApiNotFoundResponse({ description: 'User with email not found!' }),
    Public(),
    UseInterceptors(
      SetCookieInterceptor,
      new TransformDataInterceptor(UserLoginResponse),
    ),
  );
}
