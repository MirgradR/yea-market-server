import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ReviewsType } from '../types/reviews.type';

export class ReviewsDto extends ReviewsType {
  @IsString()
  @IsOptional()
  comment?: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsNumber()
  star: number;
}
