import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function CreateReviewOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Создать отзыв для продукта' }),
    ApiCreatedResponse({
      description: 'Отзыв успешно создан',
      type: SuccessMessageType,
    }),
    ApiConflictResponse({
      description: 'Отзыв для этого продукта уже существует',
    }),
    ApiNotFoundResponse({ description: 'Товар по id не найден' }),
  );
}
