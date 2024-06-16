import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function CreateProductCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product category' }),
    ApiResponse({
      status: 201,
      description: 'Product category created successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    Admin(),
  );
}
