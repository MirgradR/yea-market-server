import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function RemoveProductFromBasketOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Удалить продукт из корзины' }),
    ApiOkResponse({
      description: 'Продукт удален из корзины',
      schema: {
        example: { message: 'Basket product removed from basket' },
      },
    }),
    ApiNotFoundResponse({
      description: 'Продукт в корзине не найден',
    }),
  );
}
