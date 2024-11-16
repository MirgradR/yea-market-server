import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateBlogDto } from '../dto/updateBlog.dto';
import { UpdateBlogResponse } from '../responses/updateBlog.response';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function UpdateBlogOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a blog by ID' }),
    ApiBody({ type: UpdateBlogDto }),
    ApiOkResponse({
      description: 'The blog has been successfully updated.',
      type: UpdateBlogResponse,
    }),
    ApiNotFoundResponse({ description: 'Blog not found.' }),
    Admin(),
    UseInterceptors(new TransformDataInterceptor(UpdateBlogResponse)),
    ApiBearerAuth(),
  );
}
