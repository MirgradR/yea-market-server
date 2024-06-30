import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetUsersQuery } from '../dto/getUsers.query';
import { GetAdminUsersResponse } from '../responses/getUsers.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetUsersOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of admin users' }),
    ApiQuery({ type: GetUsersQuery }),
    ApiOkResponse({
      description: 'List of admin users retrieved successfully',
      type: GetAdminUsersResponse,
    }),
    ApiNotFoundResponse({ description: 'Admin users not found' }),
    UseInterceptors(new TransformDataInterceptor(GetAdminUsersResponse)),
  );
}
