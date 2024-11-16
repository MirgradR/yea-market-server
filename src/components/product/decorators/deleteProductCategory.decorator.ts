import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteProductCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a product category' }),
    ApiOkResponse({
      description: 'Product category deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Admin(),
  );
}
