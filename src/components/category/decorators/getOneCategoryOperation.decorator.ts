import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { CategoryType } from 'src/helpers/types/category.type';

export function GetOneCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single category by ID' }),
    ApiOkResponse({
      description: 'Category retrieved successfully',
      type: CategoryType,
    }),
    ApiNotFoundResponse({
      description: 'Category with this ID not found',
    }),
    Public(),
    UseInterceptors(new TransformDataInterceptor(CategoryType)),
  );
}
