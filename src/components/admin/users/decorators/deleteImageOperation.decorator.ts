import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete admin user image' }),
    ApiResponse({
      status: 200,
      description: 'Image deleted successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Image not found' }),
  );
}
