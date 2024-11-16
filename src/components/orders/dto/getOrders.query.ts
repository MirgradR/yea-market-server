import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OrderSortEnum } from 'src/helpers/constants/orderSort.enum';
import { OrderStatusEnum } from 'src/helpers/constants/orderStatus.enum';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetOrdersQuery extends PickType(PageOptionsDto, [
  'take',
  'page',
  'q',
  'order',
]) {
  @IsOptional()
  @ApiProperty({ description: 'Сортировка закзов', enum: OrderSortEnum })
  orderBy?: OrderSortEnum;

  @IsOptional()
  @ApiProperty({ description: 'Сортировка по статусу', enum: OrderSortEnum })
  status?: OrderStatusEnum;
}
