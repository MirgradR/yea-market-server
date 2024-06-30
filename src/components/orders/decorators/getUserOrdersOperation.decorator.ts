import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Client } from 'src/common/decorators/isClient.decorator';
import { GetOrdersResponse } from '../responses/getOrders.response';

export function GetUserOrdersOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить заказы пользователя' }),
    ApiOkResponse({
      description: 'Заказы пользователя успешно получены',
      type: GetOrdersResponse,
    }),
    Client(),
  );
}
