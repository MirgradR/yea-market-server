import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';

export function DeleteUsersOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete multiple users' }),
    ApiBearerAuth(),
    Roles(AdminRole.ADMINISTRATOR),
    ApiOkResponse({
      description: 'Users deleted successfully',
      type: SuccessMessageType,
    }),
  );
}
