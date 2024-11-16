import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductType } from 'src/helpers/types/product.type';

export class GetProductsResponse {
  @Type(() => ProductType)
  @ApiProperty({ type: [ProductType] })
  products: ProductType[];
}
