import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { GetOneProductResponse } from '../responses/getOneProductResponse';

export function GetOneProductOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single product by ID' }),
    ApiOkResponse({
      description: 'Product retrieved successfully',
      type: GetOneProductResponse,
    }),
    UseInterceptors(new TransformDataInterceptor(GetOneProductResponse)),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Public(),
  );
}
