import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function LoginApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiResponse({
      status: 200,
      description: 'Authentication successful',
      schema: {
        example: {
          access_token: 'access_token112233333',
          user: {
            firstName: 'John',
            lastName: 'Doe',
            password: '12345',
            phone: '+1234567890',
            email: 'john.doe@example.com',
          },
        },
      },
    }),
    ApiBody({
      schema: {
        example: {
          email: 'test@ya.ru',
          password: '123456',
        },
      },
    }),
  );
}

export function RegisterUserApiDocs() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Register a new user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The user has been successfully registered.',
      schema: {
        example: {
          firstName: 'John',
          lastName: 'Doe',
          password: '12345',
          phone: '+1234567890',
          email: 'john.doe@example.com',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User data already exists',
    }),
  );
}

export function RefreshApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh authentication token' }),
    ApiResponse({
      status: 200,
      description: 'Token refreshed successfully',
      schema: {
        example: {
          access_token: 'access_token112233333',
          user: {
            firstName: 'John',
            lastName: 'Doe',
            password: '12345',
            phone: '+1234567890',
            email: 'john.doe@example.com',
          },
        },
      },
    }),
  );
}

export function LogoutApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user' }),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'User logged out successfully' }),
  );
}
