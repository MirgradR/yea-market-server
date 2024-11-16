import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { ProductType } from './product.type';

export class OrderProductsType {
  @ApiProperty({
    description: 'The unique identifier for the order product entry.',
    example: 'f9bd2ba4-2ee7-4212-a6e4-04a6040467ff',
  })
  id: string;

  @Exclude()
  orderId: string;

  @ApiProperty({
    description: 'The product associated with this entry.',
    type: () => ProductType,
  })
  product: ProductType;

  @Exclude()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product ordered.',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'The total price for the quantity of the product ordered.',
    example: 110,
  })
  totalPrice: number;
}
