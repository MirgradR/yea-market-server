import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UpdateReviewOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Обновить отзыв' }),
    ApiOkResponse({
      description: 'Отзыв успешно обновлен',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Отзыв не найден' }),
  );
}
