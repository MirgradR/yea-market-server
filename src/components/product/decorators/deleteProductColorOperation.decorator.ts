import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteProductColorOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a product color' }),
    ApiOkResponse({
      description: 'Product color deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Admin(),
  );
}
