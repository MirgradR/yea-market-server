import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Client } from 'src/common/decorators/isClient.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UsersType } from 'src/helpers/types/users.type';

export function GetMeOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user' }),
    Client(),
    ApiOkResponse({
      description: 'Returns the current user',
      type: UsersType,
    }),
    UseInterceptors(new TransformDataInterceptor(UsersType)),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}
