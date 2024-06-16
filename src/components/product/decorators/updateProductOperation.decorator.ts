import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { UpdateProductResponse } from '../responses/updateProduct.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function UpdateProductOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a product' }),
    ApiBody({ type: UpdateProductDto }),
    ApiResponse({
      status: 200,
      description: 'Product updated successfully',
      type: UpdateProductResponse,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    Admin(),
  );
}
