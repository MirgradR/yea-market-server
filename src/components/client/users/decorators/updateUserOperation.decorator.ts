import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';
import { UsersType } from 'src/helpers/types/users.type';

export function UpdateUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update user by ID' }),
    ApiBearerAuth(),
    Roles(AdminRole.ADMINISTRATOR),
    ApiOkResponse({ description: 'Returns updated user', type: UsersType }),
    UseInterceptors(new TransformDataInterceptor(UsersType)),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
  );
}
