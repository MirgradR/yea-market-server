import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateBlogDto } from '../dto/createBlog.dto';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { CreateBlogResponse } from '../responses/createBlog.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function CreateBlogOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new blog under a specific category' }),
    ApiBody({ type: CreateBlogDto }),
    ApiCreatedResponse({
      description: 'The blog has been successfully created.',
      type: CreateBlogResponse,
    }),
    ApiNotFoundResponse({ description: 'Blog category not found!' }),
    ApiConflictResponse({ description: 'Blog with this title already exits!' }),
    UseInterceptors(new TransformDataInterceptor(CreateBlogResponse)),
    ApiBearerAuth(),
    Admin(),
  );
}
