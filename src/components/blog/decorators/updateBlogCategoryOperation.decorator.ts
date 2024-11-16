import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateBlogCategoryDto } from '../dto/updateBlogCategory.dto';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function UpdateBlogCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a blog category by ID' }),
    ApiBody({ type: UpdateBlogCategoryDto }),
    ApiOkResponse({
      description: 'The category has been successfully updated.',
      type: UpdateBlogCategoryDto,
    }),
    ApiNotFoundResponse({ description: 'Category not found.' }),
    UseInterceptors(new TransformDataInterceptor(UpdateBlogCategoryDto)),
    ApiBearerAuth(),
    Admin(),
  );
}
