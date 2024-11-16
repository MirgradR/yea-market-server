import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewsEntity } from './entities/reviews.entity';
import { Repository } from 'typeorm';
import { ProductCommonService } from '../productCommon/productCommon.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { GetReviewsResponse } from './responses/getReviews.response';

@Injectable()
export class ReviewsService {
  private logger = new Logger(ReviewsService.name);

  constructor(
    @InjectRepository(ReviewsEntity)
    private reviewsRepository: Repository<ReviewsEntity>,
    private productCommonService: ProductCommonService,
  ) {}

  async createReview(
    dto: CreateReviewDto,
    productId: string,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Создание отзыва для продукта с ID ${productId} пользователем с ID ${currentUser.id}`,
    );

    const product = await this.productCommonService.findProductById(productId);
    const isReviewExists = await this.reviewsRepository.findOne({
      where: { productId, userId: currentUser.id },
    });
    if (isReviewExists) {
      this.logger.error(`Отзыв для продукта с ID ${productId} уже существует`);
      throw new ConflictException('You already have review for this product!');
    }
    const review = this.reviewsRepository.create({
      productId: product.id,
      userId: currentUser.id,
      ...dto,
    });

    await this.reviewsRepository.save(review);

    this.logger.log(`Отзыв для продукта с ID ${productId} успешно создан`);
    return { message: 'Отзыв успешно создан!' };
  }

  async getReviews(currentUser: ClientTokenDto): Promise<GetReviewsResponse> {
    this.logger.log(`Получение отзывов пользователя с ID ${currentUser.id}`);

    const [reviews, totalCount] = await this.reviewsRepository.findAndCount({
      where: { userId: currentUser.id },
      relations: { product: { colors: true, medias: true } },
    });

    this.logger.log(
      `Отзывы пользователя с ID ${currentUser.id} успешно получены: всего ${totalCount} отзывов`,
    );
    return { reviews, totalCount };
  }

  async updateReview(
    reviewId: string,
    dto: UpdateReviewDto,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Обновление отзыва с ID ${reviewId} пользователем с ID ${currentUser.id}`,
    );

    const review = await this.findReviewById(reviewId, currentUser.id);

    Object.assign(review, dto);

    await this.reviewsRepository.save(review);

    this.logger.log(`Отзыв с ID ${reviewId} успешно обновлен`);
    return { message: 'Отзыв успешно обновлен!' };
  }

  async deleteReview(
    reviewId: string,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Удаление отзыва с ID ${reviewId} пользователем с ID ${currentUser.id}`,
    );

    const review = await this.findReviewById(reviewId, currentUser.id);

    await this.reviewsRepository.delete({
      id: review.id,
      userId: currentUser.id,
    });

    this.logger.log(`Отзыв с ID ${reviewId} успешно удален`);
    return { message: 'Отзыв успешно удален!' };
  }

  private async findReviewById(reviewId: string, userId: string) {
    this.logger.log(
      `Поиск отзыва с ID ${reviewId} для пользователя с ID ${userId}`,
    );

    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId, userId },
    });
    if (!review) {
      this.logger.error(`Отзыв с ID ${reviewId} не найден`);
      throw new NotFoundException('Review not found!!');
    }
    this.logger.log(`Отзыв с ID ${reviewId} найден`);
    return review;
  }
}
