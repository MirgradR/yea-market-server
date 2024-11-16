import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateCategoryResponse } from '../responses/createCategory.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function CreateCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new category' }),
    ApiResponse({
      status: 201,
      description: 'Category created successfully',
      type: CreateCategoryResponse,
    }),
    ApiConflictResponse({
      description: 'Category with the same title already exists',
    }),
    Admin(),
  );
}
