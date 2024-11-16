import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetBlogCategoriesResponse } from '../responses/getBlogsCategory.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function GetBlogsCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all blog categories' }),
    ApiOkResponse({
      description: 'Returns all blog categories.',
      type: [GetBlogCategoriesResponse],
    }),
    UseInterceptors(new TransformDataInterceptor(GetBlogCategoriesResponse)),
    Public(),
  );
}
