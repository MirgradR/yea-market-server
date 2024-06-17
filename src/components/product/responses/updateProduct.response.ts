import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { ProductType } from 'src/helpers/types/product.type';

export class UpdateProductResponse extends PickType(SuccessResponse, [
  'message',
] as const) {
  @Type(() => ProductType)
  @ApiProperty({ type: ProductType })
  product: ProductType;
}
