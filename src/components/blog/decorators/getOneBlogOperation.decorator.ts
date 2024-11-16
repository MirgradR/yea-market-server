import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetOneBlogResponse } from '../responses/getOneBlog.response';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function GetOneBlogOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single blog by ID' }),
    ApiOkResponse({
      description: 'Blog returned successfully!',
      type: GetOneBlogResponse,
    }),
    ApiNotFoundResponse({ description: 'Blog not found.' }),
    UseInterceptors(new TransformDataInterceptor(GetOneBlogResponse)),
    Public(),
  );
}
