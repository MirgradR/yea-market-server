import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { Client } from 'src/common/decorators/isClient.decorator';

export function DeleteAccountOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete current user account' }),
    ApiBearerAuth(),
    Client(),
    ApiOkResponse({
      description: 'Account deleted successfully',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}
