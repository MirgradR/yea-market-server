import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/createUser.dto';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function CreateUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new admin user' }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'Admin user created successfully',
      type: AdminUsersResponse,
    }),
    ApiResponse({ status: 409, description: 'User with email already exists' }),
    UseInterceptors(new TransformDataInterceptor(AdminUsersResponse)),
  );
}
