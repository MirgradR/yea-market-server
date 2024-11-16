import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetProductsResponse } from '../responses/getProducts.response';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetProductsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a list of products' }),
    ApiOkResponse({
      description: 'Products retrieved successfully',
      type: GetProductsResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(GetProductsResponse)),
    Public(),
  );
}
