import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';

export function GetMeOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current admin user details' }),
    ApiResponse({
      status: 200,
      description: 'Current admin user details retrieved successfully',
      type: AdminUsersResponse,
    }),
    ApiResponse({ status: 404, description: 'Admin user not found' }),
    UseInterceptors(new TransformDataInterceptor(AdminUsersResponse)),
  );
}
