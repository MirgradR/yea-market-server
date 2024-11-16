import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteProductOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a product' }),
    ApiResponse({
      status: 200,
      description: 'Product deleted successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    Admin(),
  );
}
