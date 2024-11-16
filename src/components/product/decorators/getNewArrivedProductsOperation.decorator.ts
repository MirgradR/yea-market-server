import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetProductsResponse } from '../responses/getProducts.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function GetNewArrivedProductsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get new arrived  products' }),
    ApiOkResponse({
      description: 'Products retrieved successfully',
      type: GetProductsResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(GetProductsResponse)),
    Public(),
  );
}
