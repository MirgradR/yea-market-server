import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProductsResponse } from '../responses/getProducts.response';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function GetProductsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a list of products' }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: GetProductsResponse,
    }),
    Public(),
  );
}
