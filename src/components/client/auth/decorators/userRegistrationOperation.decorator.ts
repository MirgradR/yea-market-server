import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserLoginResponse } from '../responses/userLogin.response';
import { UserLoginDto } from '../dto/userLogin.dto';
import { UserRegistrationResponse } from '../responses/userRegistration.response';

export function UserRegistrationOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'User registration' }),
    ApiBody({ type: UserLoginDto }),
    ApiCreatedResponse({
      description: 'User registration successful!',
      type: UserRegistrationResponse,
    }),
    ApiConflictResponse({ description: 'User with this email already exists' }),
    Public(),
    UseInterceptors(
      SetCookieInterceptor,
      new TransformDataInterceptor(UserLoginResponse),
    ),
  );
}
