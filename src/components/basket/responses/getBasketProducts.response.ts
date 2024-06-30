import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BasketProductsType } from 'src/helpers/types/basketProducts.type';

export class GetBasketProducts {
  @ApiProperty({ type: [BasketProductsType] })
  @Type(() => BasketProductsType)
  basketProducts: BasketProductsType[];

  @ApiProperty({ description: 'Basket products total count' })
  totalCount: number;
}
