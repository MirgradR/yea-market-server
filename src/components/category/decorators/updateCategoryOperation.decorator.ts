import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UpdateCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a category' }),
    ApiResponse({
      status: 200,
      description: 'Category updated successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({
      description: 'Category with this ID not found',
    }),
    Admin(),
  );
}
