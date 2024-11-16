import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { BasketProductsEntity } from './entities/basketProducts.entity';
import { Repository } from 'typeorm';
import { ProductCommonService } from '../productCommon/productCommon.service';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { UpdateBasketProductCountDto } from './dto/updateBasketProductCount.dto';
import { GetBasketProductsQuery } from './dto/getBasketProducts.query';
import { GetBasketProducts } from './responses/getBasketProducts.response';

@Injectable()
export class BasketService {
  private readonly logger = new Logger(BasketService.name);

  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @InjectRepository(BasketProductsEntity)
    private basketProductsRepository: Repository<BasketProductsEntity>,
    private productCommonService: ProductCommonService,
  ) {}

  async addProductToBasket(
    productId: string,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Получение продукта с ID ${productId} для добавления в корзину пользователя ${currentUser.id}`,
    );

    const product = await this.productCommonService.findProductById(productId);

    this.logger.log(`Поиск корзины для пользователя с ID ${currentUser.id}`);
    const basket = await this.basketRepository.findOne({
      where: { userId: currentUser.id },
    });

    const checkProduct = await this.basketProductsRepository.findOne({
      where: { productId: product.id, basketId: basket.id },
    });
    if (checkProduct) throw new ConflictException('Product already in basket!');

    if (!basket) {
      this.logger.log(
        `Корзина для пользователя ${currentUser.id} не найдена, создаём новую корзину`,
      );
      const newBasket = this.basketRepository.create({
        userId: currentUser.id,
      });
      await this.basketRepository.save(newBasket);

      this.logger.log(
        `Добавление продукта в новую корзину пользователя ${currentUser.id}`,
      );
      const basketProduct = this.basketProductsRepository.create({
        basketId: newBasket.id,
        quantity: 1,
        totalPrice: product.price,
        productId: product.id,
      });

      await this.basketProductsRepository.save(basketProduct);

      this.logger.log(
        `Продукт с ID ${productId} успешно добавлен в корзину пользователя ${currentUser.id}`,
      );
    } else {
      this.logger.log(
        `Добавление продукта в существующую корзину пользователя ${currentUser.id}`,
      );
      const basketProduct = this.basketProductsRepository.create({
        basketId: basket.id,
        quantity: 1,
        totalPrice: product.price,
        productId: product.id,
      });

      await this.basketProductsRepository.save(basketProduct);

      this.logger.log(
        `Продукт с ID ${productId} успешно добавлен в корзину пользователя ${currentUser.id}`,
      );
    }

    return { message: 'Product added to basket' };
  }

  async getBasketProducts(
    currentUser: ClientTokenDto,
    query: GetBasketProductsQuery,
  ): Promise<GetBasketProducts> {
    const { take = 10, page = 1 } = query;
    this.logger.log(
      `Получение продуктов в корзине пользователя с ID ${currentUser.id}`,
    );

    const [basketProducts, totalCount] = await this.basketProductsRepository
      .createQueryBuilder('basketProducts')
      .leftJoin('basketProducts.basket', 'basket')
      .leftJoinAndSelect('basketProducts.product', 'product')
      .leftJoinAndSelect('product.colors', 'colors')
      .leftJoinAndSelect('product.medias', 'medias')
      .where('basket.userId = :userId', { userId: currentUser.id })
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    this.logger.log(
      `Продукты в корзине пользователя с ID ${currentUser.id} успешно получены`,
    );
    return { totalCount, basketProducts };
  }

  async updateBasketProductCount(
    basketProductId: string,
    dto: UpdateBasketProductCountDto,
    currentUser: ClientTokenDto,
  ) {
    this.logger.log(
      `Поиск продукта в корзине по ID ${basketProductId} для пользователя ${currentUser.id}`,
    );

    const basketProduct = await this.findBasketProductById(
      basketProductId,
      currentUser.id,
    );

    this.logger.log(
      `Обновление количества продукта в корзине. Текущее количество: ${basketProduct.quantity}, изменяем на: ${dto.count}`,
    );
    basketProduct.quantity += dto.count;
    basketProduct.totalPrice =
      basketProduct.quantity * basketProduct.product.price;

    if (basketProduct.quantity > basketProduct.product.quantity) {
      this.logger.error(
        `Недостаточно количества товара на складе для продукта с ID ${basketProduct.product.id}`,
      );
      throw new ConflictException('We do not have this quantity in stock');
    }

    await this.basketProductsRepository.save(basketProduct);

    this.logger.log(
      `Количество продукта в корзине успешно обновлено для продукта с ID ${basketProductId}`,
    );
    return { message: 'Basket product count updated' };
  }

  async removeProductFromBasket(
    basketProductId: string,
    currentUser: ClientTokenDto,
  ) {
    this.logger.log(
      `Удаление продукта из корзины по ID ${basketProductId} для пользователя ${currentUser.id}`,
    );

    const basketProduct = await this.findBasketProductById(
      basketProductId,
      currentUser.id,
    );

    await this.basketProductsRepository.delete({ id: basketProduct.id });

    this.logger.log(
      `Продукт с ID ${basketProductId} успешно удален из корзины пользователя ${currentUser.id}`,
    );
    return { message: 'Basket product removed from basket' };
  }

  private async findBasketProductById(basketProductId: string, userId: string) {
    this.logger.log(`Поиск корзины для пользователя с ID ${userId}`);
    const basket = await this.basketRepository.findOne({
      where: { userId: userId },
    });
    if (!basket) {
      this.logger.error(`Корзина для пользователя с ID ${userId} не найдена`);
      throw new NotFoundException('Basket product not found!');
    }

    this.logger.log(`Поиск продукта в корзине по ID ${basketProductId}`);
    const basketProduct = await this.basketProductsRepository.findOne({
      where: { id: basketProductId, basketId: basket.id },
      relations: { product: true },
    });
    if (!basketProduct) {
      this.logger.error(`Продукт в корзине с ID ${basketProductId} не найден`);
      throw new NotFoundException('Basket product not found!');
    }

    this.logger.log(`Продукт в корзине с ID ${basketProductId} найден`);
    return basketProduct;
  }
}
