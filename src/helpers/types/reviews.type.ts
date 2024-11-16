import { ApiProperty } from '@nestjs/swagger';
import { UsersType } from './users.type';
import { ProductType } from './product.type';

export class ReviewsType {
  @ApiProperty({ description: 'Unique identifier of the review' })
  id: string;

  @ApiProperty({ description: 'Comment for the review', required: false })
  comment?: string;

  @ApiProperty({ description: 'Star rating of the review', example: 5 })
  star: number;

  @ApiProperty({
    description: 'Product associated with the review',
    type: () => ProductType,
  })
  product: ProductType;

  @ApiProperty({
    description: 'User who created the review',
    type: () => UsersType,
  })
  user: UsersType;
}
