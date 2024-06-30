import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteProductsEntity } from './entities/favoriteProduct.entity';
import { ProductCommonService } from '../productCommon/productCommon.service';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { GetFavoriteProductsQuery } from './dto/getFavoriteProducts.query';
import { GetFavoriteProductsResponse } from './responses/getFavoriteProducts.response';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    @InjectRepository(FavoriteProductsEntity)
    private favoriteProductsRepository: Repository<FavoriteProductsEntity>,
    private productCommonService: ProductCommonService,
  ) {}

  async addProductToFavorites(
    productId: string,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Добавление продукта с ID ${productId} в избранное для пользователя ${currentUser.id}`,
    );

    const product = await this.productCommonService.findProductById(productId);
    const checkFavoriteProduct = await this.favoriteProductsRepository.findOne({
      where: { productId: product.id, userId: currentUser.id },
    });
    if (checkFavoriteProduct) {
      this.logger.error(
        `Продукт с ID ${productId} уже добавлен в избранное для пользователя ${currentUser.id}`,
      );
      throw new ConflictException(
        'You already added this product to favorites list',
      );
    }
    const favoriteProduct = this.favoriteProductsRepository.create({
      productId: product.id,
      userId: currentUser.id,
    });

    await this.favoriteProductsRepository.save(favoriteProduct);
    this.logger.log(
      `Продукт с ID ${productId} успешно добавлен в избранное для пользователя ${currentUser.id}`,
    );
    return { message: 'Product added to favorites' };
  }

  async getFavoriteProducts(
    currentUser: ClientTokenDto,
    query?: GetFavoriteProductsQuery,
  ): Promise<GetFavoriteProductsResponse> {
    this.logger.log(
      `Получение избранных продуктов для пользователя ${currentUser.id}`,
    );

    const { take = 10, page = 1 } = query;
    const [favoriteProducts, totalCount] = await this.favoriteProductsRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.product', 'products')
      .leftJoinAndSelect('products.colors', 'color')
      .leftJoinAndSelect('products.medias', 'productMedia')
      .where('favorites.userId = :userId', { userId: currentUser.id })
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    this.logger.log(
      `Получено ${favoriteProducts.length} избранных продуктов для пользователя ${currentUser.id}`,
    );
    return { totalCount, favoriteProducts };
  }

  async removeProductFromFavorites(
    favoriteProductId: string,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Удаление продукта с ID ${favoriteProductId} из избранного для пользователя ${currentUser.id}`,
    );

    const favoriteProduct = await this.findFavoriteProductById(
      favoriteProductId,
      currentUser.id,
    );
    await this.favoriteProductsRepository.delete({
      id: favoriteProduct.id,
      userId: currentUser.id,
    });

    this.logger.log(
      `Продукт с ID ${favoriteProductId} успешно удален из избранного для пользователя ${currentUser.id}`,
    );
    return { message: 'Product removed from favorites list' };
  }

  private async findFavoriteProductById(
    favoriteProductId: string,
    userId: string,
  ) {
    this.logger.log(`Поиск избранного продукта с ID ${favoriteProductId}`);

    const favoriteProduct = await this.favoriteProductsRepository.findOne({
      where: { id: favoriteProductId, userId: userId },
    });
    if (!favoriteProduct) {
      this.logger.error(
        `Избранный продукт с ID ${favoriteProductId} не найден`,
      );
      throw new NotFoundException('Favorite product not found!');
    }

    this.logger.log(`Избранный продукт с ID ${favoriteProductId} найден`);
    return favoriteProduct;
  }
}
