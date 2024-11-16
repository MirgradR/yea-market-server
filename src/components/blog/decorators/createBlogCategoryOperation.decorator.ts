import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateBlogCategoryDto } from '../dto/createBlogCategory.dto';
import { CreateBlogCategoryResponse } from '../responses/createBlogCategory.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function CreateBlogCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new blog category' }),
    ApiBody({ type: CreateBlogCategoryDto }),
    ApiCreatedResponse({
      description: 'The category has been successfully created.',
      type: CreateBlogCategoryResponse,
    }),
    ApiConflictResponse({
      description: 'Blog category with this title already exists',
    }),
    ApiBearerAuth(),
    UseInterceptors(new TransformDataInterceptor(CreateBlogCategoryResponse)),
    Admin(),
  );
}
