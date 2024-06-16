import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { ProductType } from 'src/helpers/types/product.type';

export function GetOneProductOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single product by ID' }),
    ApiResponse({
      status: 200,
      description: 'Product retrieved successfully',
      type: ProductType,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    Public(),
  );
}