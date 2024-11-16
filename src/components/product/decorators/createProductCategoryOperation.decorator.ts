import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function CreateProductCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product category' }),
    ApiCreatedResponse({
      description: 'Product category created successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Admin(),
  );
}
