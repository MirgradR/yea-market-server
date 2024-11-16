import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UpdateUserResponse } from '../responses/updateUser.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function UpdateUserOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update admin user details' }),
    ApiParam({ name: 'userId', description: 'Admin user ID' }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({
      status: 200,
      description: 'Admin user updated successfully',
      type: UpdateUserResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(UpdateUserResponse)),
    ApiResponse({ status: 404, description: 'Admin user not found' }),
  );
}
