import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { UsersEntity } from '../entities/user.entity';

export function GetUsersOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get users' }),
    ApiBearerAuth(),
    Admin(),
    ApiOkResponse({
      description: 'Returns list of users',
      type: [UsersEntity],
    }),
  );
}
