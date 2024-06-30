import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetOneBlogCategoryResponse } from '../responses/getOneBlogCategory.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function GetOneBlogCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single blog category by ID' }),
    ApiOkResponse({
      description: 'Returns the requested blog category.',
      type: GetOneBlogCategoryResponse,
    }),
    ApiNotFoundResponse({ description: 'Category not found.' }),
    UseInterceptors(new TransformDataInterceptor(GetOneBlogCategoryResponse)),
    Public(),
  );
}
