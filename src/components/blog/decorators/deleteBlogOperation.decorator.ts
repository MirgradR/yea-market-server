import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteBlogOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a blog by ID' }),
    ApiOkResponse({
      description: 'The blog has been successfully deleted.',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Blog not found.' }),
    ApiBearerAuth(),
    Admin(),
  );
}
