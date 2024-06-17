import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetUsersQuery } from '../dto/getUsers.query';
import { GetUsersResponse } from '../responses/getUsers.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetUsersOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of admin users' }),
    ApiQuery({ type: GetUsersQuery }),
    ApiResponse({
      status: 200,
      description: 'List of admin users retrieved successfully',
      type: GetUsersResponse,
    }),
    ApiResponse({ status: 404, description: 'Admin users not found' }),
    UseInterceptors(new TransformDataInterceptor(GetUsersResponse)),
  );
}
