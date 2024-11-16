import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteReviewOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Удалить отзыв' }),
    ApiOkResponse({
      description: 'Отзыв успешно удален',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Отзыв не найден' }),
  );
}
