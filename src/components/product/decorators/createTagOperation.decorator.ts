import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';

export function CreateTagOperation() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'Tag created successfully',
    }),
    ApiOperation({ summary: 'Tag created successfully' }),
    ApiNotFoundResponse({ description: 'Product not found!' }),
    ApiConflictResponse({
      description: 'This tag already exists for this product',
    }),
    Admin(),
  );
}
