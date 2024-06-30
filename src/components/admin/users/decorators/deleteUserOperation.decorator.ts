import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';

export function DeleteUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete admin user' }),
    ApiParam({ name: 'userId', description: 'Admin user ID' }),
    ApiOkResponse({
      description: 'Admin user deleted successfully',
      type: SuccessMessageType,
    }),
    Roles(AdminRole.ADMINISTRATOR),
    ApiNotFoundResponse({ description: 'Admin user not found' }),
  );
}
