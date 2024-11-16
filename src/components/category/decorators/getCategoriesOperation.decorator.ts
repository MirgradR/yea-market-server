import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCategoriesResponse } from '../responses/getCategories.response';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetCategoriesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a list of categories' }),
    ApiOkResponse({
      description: 'Categories retrieved successfully',
      type: GetCategoriesResponse,
    }),
    Public(),
    UseInterceptors(new TransformDataInterceptor(GetCategoriesResponse)),
  );
}
