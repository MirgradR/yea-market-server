import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProductType } from '../types/product.type';
import { ColorDto } from './color.dto';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto extends OmitType(ProductType, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ description: 'Category ids', type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  categoryIds: string[];

  @ApiProperty({ description: 'Product colors', type: [ColorDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  colors: ColorDto[];

  @ApiProperty({ description: 'Product details description' })
  @IsString()
  detailsDesc: string;

  @ApiProperty({ description: 'Product dimensions' })
  @IsString()
  dimensions: string;

  @ApiProperty({ description: 'Old price of the product' })
  @IsNumber()
  @IsOptional()
  oldPrice: number;

  @ApiProperty({ description: 'Current price of the product' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Quantity of the product in stock' })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Tags associated with the product',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Title of the product' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Stock status of the product' })
  @IsBoolean()
  stockStatus: boolean;
}
