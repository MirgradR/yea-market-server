import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a category' }),
    ApiOkResponse({
      description: 'Category deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({
      description: 'Category with this ID not found',
    }),
    Admin(),
  );
}
