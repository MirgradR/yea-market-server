import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UpdateUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update admin user details' }),
    ApiParam({ name: 'userId', description: 'Admin user ID' }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({
      status: 200,
      description: 'Admin user updated successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Admin user not found' }),
  );
}
