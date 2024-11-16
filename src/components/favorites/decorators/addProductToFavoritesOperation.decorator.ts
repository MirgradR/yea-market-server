import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function AddProductToFavoritesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Add product to favorites' }),
    ApiCreatedResponse({ description: 'Product added to favorites' }),
    ApiConflictResponse({ description: 'Product already in favorites' }),
  );
}
