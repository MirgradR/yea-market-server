import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetBasketProducts } from '../responses/getBasketProducts.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetBasketProductsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить продукты в корзине' }),
    ApiOkResponse({
      description: 'Список продуктов в корзине',
      type: GetBasketProducts,
    }),

    UseInterceptors(new TransformDataInterceptor(GetBasketProducts)),
  );
}
