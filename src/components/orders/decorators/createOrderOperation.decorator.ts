import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { Client } from 'src/common/decorators/isClient.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function CreateOrderOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Создать заказ' }),
    ApiCreatedResponse({
      description: 'Заказ успешно создан',
      type: SuccessMessageType,
    }),
    ApiBody({ type: CreateOrderDto }),
    Client(),
  );
}
