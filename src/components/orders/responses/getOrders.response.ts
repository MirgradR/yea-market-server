import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderType } from 'src/helpers/types/orders.type';

export class GetOrdersResponse {
  @ApiProperty({ type: [OrderType] })
  @Type(() => OrderType)
  orders: OrderType[];

  @ApiProperty({ description: 'Количество закозов' })
  totalCount: number;
}
