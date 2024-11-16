import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete admin user image' }),
    ApiOkResponse({
      description: 'Image deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Image not found' }),
  );
}
