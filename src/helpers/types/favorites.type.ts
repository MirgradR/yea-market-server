import { Exclude, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from './product.type';

export class FavoritesType {
  @ApiProperty({
    description: 'Unique identifier for the favorite product entry',
  })
  id: string;

  @Exclude()
  productId: string;

  @Exclude()
  userId: string;

  @Type(() => ProductType)
  @ApiProperty({ type: ProductType, description: 'Details of the product' })
  product: ProductType;
}
