import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { Client } from 'src/common/decorators/isClient.decorator';
import { UpdateReviewOperation } from './decorators/updateReviewOperation.decorator';
import { DeleteReviewOperation } from './decorators/deleteReviewOperation.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GetReviewsOperation } from './decorators/getReviewsOperation.decorator';
import { GetReviewsResponse } from './responses/getReviews.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

@ApiTags('reviews')
@Controller('reviews')
@ApiBearerAuth()
@Client()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId')
  async createReview(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.reviewsService.createReview(dto, productId, currentUser);
  }

  @Get()
  @GetReviewsOperation()
  async getReviews(
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<GetReviewsResponse> {
    return this.reviewsService.getReviews(currentUser);
  }

  @Patch(':reviewId')
  @UpdateReviewOperation()
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.reviewsService.updateReview(reviewId, dto, currentUser);
  }

  @Delete(':reviewId')
  @DeleteReviewOperation()
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.reviewsService.deleteReview(reviewId, currentUser);
  }
}
