import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetBlogsResponse } from '../responses/getBlogs.response';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';

export function GetBlogsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all blogs' }),
    ApiOkResponse({
      description: 'Returns all blogs.',
      type: [GetBlogsResponse],
    }),
    ApiNotFoundResponse({ description: 'No blogs found.' }),
    UseInterceptors(new TransformDataInterceptor(GetBlogsResponse)),
    Public(),
  );
}
