import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCategoriesResponse } from '../responses/getCategories.response';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function GetCategoriesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a list of categories' }),
    ApiResponse({
      status: 200,
      description: 'Categories retrieved successfully',
      type: GetCategoriesResponse,
    }),
    Public(),
  );
}
