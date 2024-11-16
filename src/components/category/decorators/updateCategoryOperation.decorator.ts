import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UpdateCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a category' }),
    ApiOkResponse({
      description: 'Category updated successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({
      description: 'Category with this ID not found',
    }),
    Admin(),
  );
}
