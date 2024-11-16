import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteBlogCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a blog category by ID' }),
    ApiOkResponse({
      description: 'The category has been successfully deleted.',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Category not found.' }),
    ApiBearerAuth(),
    Admin(),
  );
}
