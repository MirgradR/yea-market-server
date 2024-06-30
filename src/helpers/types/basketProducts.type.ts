import { ProductType } from './product.type';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BasketProductsType {
  @ApiProperty({
    description: 'Уникальный идентификатор продукта в корзине',
    example: 'b765d5a1-3b99-4b9b-9b8c-1c9e9b6e1d9c',
  })
  id: string;

  @ApiProperty({
    description: 'Общая стоимость продукта в корзине',
    example: 200,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Количество продукта в корзине',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    type: ProductType,
    description: 'Информация о продукте',
  })
  @Type(() => ProductType)
  product: ProductType;
}
