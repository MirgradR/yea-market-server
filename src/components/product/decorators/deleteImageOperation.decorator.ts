import { applyDecorators, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteImageOperation() {
  return applyDecorators(
    Delete(':productId/images/:imageId'),
    ApiOperation({ summary: 'Delete an image of a product' }),
    ApiResponse({
      status: 200,
      description: 'Image deleted successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    Admin(),
  );
}
