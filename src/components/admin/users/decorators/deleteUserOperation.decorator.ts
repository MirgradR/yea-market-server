import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';

export function DeleteUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete admin user' }),
    ApiParam({ name: 'userId', description: 'Admin user ID' }),
    ApiResponse({
      status: 200,
      description: 'Admin user deleted successfully',
      type: SuccessMessageType,
    }),
    Roles(AdminRole.ADMINISTRATOR),
    ApiResponse({ status: 404, description: 'Admin user not found' }),
  );
}
