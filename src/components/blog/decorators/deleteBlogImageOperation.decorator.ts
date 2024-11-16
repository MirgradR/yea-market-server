import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteBlogImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete an image from a blog' }),
    ApiOkResponse({
      description: 'The image has been successfully deleted.',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Blog or image not found.' }),
    ApiBearerAuth(),
    Admin(),
  );
}
