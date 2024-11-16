import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatusEnum } from 'src/helpers/constants/orderStatus.enum';

export class UpdateOrderDto {
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;
}
