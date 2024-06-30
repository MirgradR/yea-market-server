import { applyDecorators, Delete } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteProductImageOperation() {
  return applyDecorators(
    Delete(':productId/images/:imageId'),
    ApiOperation({ summary: 'Delete an image of a product' }),
    ApiOkResponse({
      description: 'Image deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Product with this ID not found' }),
    Admin(),
  );
}
