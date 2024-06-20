import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { UsersEntity } from '../entities/user.entity';

export function GetOneUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiBearerAuth(),
    Admin(),
    ApiOkResponse({ description: 'Returns a user by ID', type: UsersEntity }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}
