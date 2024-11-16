import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Client } from 'src/common/decorators/isClient.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function CancelOrderOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Отменить заказ' }),
    ApiOkResponse({
      description: 'Заказ успешно отменён',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Order not found!' }),
    Client(),
  );
}
