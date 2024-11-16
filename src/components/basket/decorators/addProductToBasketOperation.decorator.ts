import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function AddProductToBasketOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Добавить продукт в корзину' }),
    ApiCreatedResponse({
      description: 'Продукт успешно добавлен в корзину',
      schema: {
        example: { message: 'Product added to basket' },
      },
    }),
    ApiConflictResponse({
      description:
        'Продукт уже находится в корзине или произошла другая ошибка',
    }),
    ApiNotFoundResponse({ description: 'Product not found!' }),
  );
}
