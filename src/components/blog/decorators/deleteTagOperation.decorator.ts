import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteTagOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a tag by ID' }),
    ApiOkResponse({
      description: 'The tag has been successfully deleted.',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Tag not found!' }),
    ApiBearerAuth(),
    Admin(),
  );
}
