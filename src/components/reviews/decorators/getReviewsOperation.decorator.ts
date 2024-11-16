import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetReviewsResponse } from '../responses/getReviews.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetReviewsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить отзывы пользователя' }),
    ApiOkResponse({
      description: 'Список отзывов успешно получен',
      type: GetReviewsResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(GetReviewsResponse)),
  );
}
