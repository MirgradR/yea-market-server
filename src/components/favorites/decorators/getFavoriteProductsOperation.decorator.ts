import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetFavoriteProductsResponse } from '../responses/getFavoriteProducts.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetFavoriteProductsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get favorite products' }),
    ApiOkResponse({
      description: 'Favorite products retrieved',
      type: GetFavoriteProductsResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(GetFavoriteProductsResponse)),
  );
}
