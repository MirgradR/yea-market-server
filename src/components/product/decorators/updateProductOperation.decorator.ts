import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { UpdateProductResponse } from '../responses/updateProduct.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function UpdateProductOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a product' }),
    ApiBody({ type: UpdateProductDto }),
    ApiOkResponse({
      description: 'Product updated successfully',
      type: UpdateProductResponse,
    }),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Admin(),
  );
}
