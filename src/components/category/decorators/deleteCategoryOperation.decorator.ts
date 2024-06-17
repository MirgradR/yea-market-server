import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a category' }),
    ApiResponse({
      status: 200,
      description: 'Category deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({
      description: 'Category with this ID not found',
    }),
    Admin(),
  );
}
