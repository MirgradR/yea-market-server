import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateCategoryResponse } from '../responses/createCategory.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { TransformDataInterceptor } from '../../../common/interceptors/transformData.interceptor';

export function CreateCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new category' }),
    ApiCreatedResponse({
      description: 'Category created successfully',
      type: CreateCategoryResponse,
    }),
    ApiConflictResponse({
      description: 'Category with the same title already exists',
    }),
    Admin(),
    UseInterceptors(new TransformDataInterceptor(CreateCategoryResponse)),
  );
}
