import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { GetOrdersResponse } from '../responses/getOrders.response';

export function GetOrdersOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить список заказов' }),
    ApiOkResponse({
      description: 'Список заказов успешно получен',
      type: GetOrdersResponse,
    }),
    Admin(),
  );
}
