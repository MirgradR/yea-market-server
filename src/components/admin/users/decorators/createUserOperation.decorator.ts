import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateAdminUserDto } from '../dto/createUser.dto';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function CreateUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new admin user' }),
    ApiBody({ type: CreateAdminUserDto }),
    ApiCreatedResponse({
      description: 'Admin user created successfully',
      type: AdminUsersResponse,
    }),
    ApiConflictResponse({ description: 'User with email already exists' }),
    UseInterceptors(new TransformDataInterceptor(AdminUsersResponse)),
  );
}
