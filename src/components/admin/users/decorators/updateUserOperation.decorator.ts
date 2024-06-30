import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdateAdminUserDto } from '../dto/updateUser.dto';
import { UpdateAdminUserResponse } from '../responses/updateUser.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function UpdateUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update admin user details' }),
    ApiParam({ name: 'userId', description: 'Admin user ID' }),
    ApiBody({ type: UpdateAdminUserDto }),
    ApiOkResponse({
      description: 'Admin user updated successfully',
      type: UpdateAdminUserResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(UpdateAdminUserResponse)),
    ApiNotFoundResponse({ description: 'Admin user not found' }),
  );
}
