import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductType } from 'src/helpers/types/product.type';

export class GetOneProductResponse {
  @Type(() => ProductType)
  @ApiProperty({ type: ProductType })
  product: ProductType;

  @ApiProperty({ description: 'Middle star of product' })
  productReviewMiddleStar: number;
}
