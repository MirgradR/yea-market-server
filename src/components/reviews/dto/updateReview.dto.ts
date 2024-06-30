import { CreateReviewDto } from './createReview.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
