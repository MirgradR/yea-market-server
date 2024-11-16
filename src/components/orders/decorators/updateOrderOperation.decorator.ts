import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateOrderDto } from '../dto/updateOrder.dto';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UpdateOrderOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Обновить статус заказа' }),
    ApiOkResponse({
      description: 'Заказ успешно обновлён',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Заказ не найден' }),
    ApiBody({ type: UpdateOrderDto }),
    Admin(),
  );
}
