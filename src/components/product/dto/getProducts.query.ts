import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ProductsOrderEnum } from 'src/helpers/constants/productsOrder.enum';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetProductsQuery extends PickType(PageOptionsDto, [
  'take',
  'q',
  'page',
  'order',
] as const) {
  @ApiProperty({ description: 'Minimum price of the product', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ description: 'Maximum price of the product', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Tags associated with the product',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({
    description: 'Order by which to sort the products',
    required: false,
    enum: ProductsOrderEnum,
  })
  @IsOptional()
  @IsEnum(ProductsOrderEnum)
  orderBy?: ProductsOrderEnum;
}

export class GetProductsDto {
  @ApiProperty({
    description: 'Color of the product',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  color?: string[];

  @ApiPropertyOptional({
    description: 'Category IDs of the product',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
