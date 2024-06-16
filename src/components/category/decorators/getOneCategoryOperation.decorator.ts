import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { CategoryType } from 'src/helpers/types/category.type';

export function GetOneCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single category by ID' }),
    ApiResponse({
      status: 200,
      description: 'Category retrieved successfully',
      type: CategoryType,
    }),
    ApiNotFoundResponse({
      description: 'Category with this ID not found',
    }),
    Public(),
  );
}
