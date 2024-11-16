import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteTagOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Удалить тэг' }),
    ApiNotFoundResponse({ description: 'Tag not found!' }),
    ApiOkResponse({
      description: 'Tag deleted successfully',
      type: SuccessMessageType,
    }),
    Admin(),
  );
}
