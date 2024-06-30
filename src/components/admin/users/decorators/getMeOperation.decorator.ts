import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';

export function GetMeOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current admin user details' }),
    ApiOkResponse({
      description: 'Current admin user details retrieved successfully',
      type: AdminUsersResponse,
    }),
    ApiNotFoundResponse({ description: 'Admin user not found' }),
    UseInterceptors(new TransformDataInterceptor(AdminUsersResponse)),
  );
}
