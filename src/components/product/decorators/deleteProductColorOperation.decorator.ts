import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteProductColorOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a product color' }),
    ApiResponse({
      status: 200,
      description: 'Product color deleted successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    Admin(),
  );
}
