import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function UpdateBasketProductCountOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Обновить количество продукта в корзине' }),
    ApiOkResponse({
      description: 'Количество продукта в корзине обновлено',
    }),
    ApiNotFoundResponse({
      description: 'Продукт в корзине не найден',
    }),
    ApiConflictResponse({
      description: 'Недостаточно количества товара на складе',
    }),
  );
}
