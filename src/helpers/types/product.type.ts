import { ApiProperty } from '@nestjs/swagger';
import { ColorType } from './color.type';
import { Type } from 'class-transformer';
import { MediaType } from './mediaType';
import { TagsType } from './tags.type';

export class ProductType {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 29.99,
  })
  price: number;

  @ApiProperty({
    description: 'The quantity of the product in stock',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'This is a high-quality product...',
  })
  detailsDesc: string;

  @ApiProperty({
    description: 'The dimensions of the product',
    example: '30x20x10 cm',
  })
  dimensions: string;

  @ApiProperty({
    description: 'The old price of the product before discount',
    example: 39.99,
  })
  oldPrice: number;

  @ApiProperty({
    description: 'Tags associated with the product',
    type: [TagsType],
  })
  @Type(() => TagsType)
  tags: TagsType[];

  @ApiProperty({
    description: 'The title of the product',
    example: 'Awesome Product',
  })
  title: string;

  @ApiProperty({
    description: 'Stock status indicating if the product is available',
    example: true,
  })
  stockStatus: boolean;

  @ApiProperty({
    description: 'The date when the product was created',
    example: '2023-06-15T07:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the product was last updated',
    example: '2023-06-16T07:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({ type: [ColorType] })
  @Type(() => ColorType)
  colors: ColorType[];

  @ApiProperty({ type: [MediaType] })
  @Type(() => MediaType)
  medias: MediaType[];
}
