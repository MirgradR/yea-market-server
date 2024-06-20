import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Client } from 'src/common/decorators/isClient.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UsersType } from 'src/helpers/types/users.type';

export function UpdateAccountOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update current user account' }),
    ApiBearerAuth(),
    Client(),
    ApiOkResponse({
      description: 'Returns updated user account',
      type: UsersType,
    }),
    UseInterceptors(new TransformDataInterceptor(UsersType)),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
  );
}
