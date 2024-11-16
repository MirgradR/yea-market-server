import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReviewsType } from 'src/helpers/types/reviews.type';

export class GetReviewsResponse {
  @ApiProperty({ type: [ReviewsType] })
  @Type(() => ReviewsType)
  reviews: ReviewsType[];

  @ApiProperty({ description: 'Users reviews total count' })
  totalCount: number;
}
