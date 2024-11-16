import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { MediaService } from 'src/libs/media/media.service';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { CreateProductResponse } from './responses/createProduct.response';
import { GetProductsResponse } from './responses/getProducts.response';
import { ProductType } from 'src/helpers/types/product.type';
import { UpdateProductResponse } from './responses/updateProduct.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CreateProductColorResponse } from './responses/createProductColor.response';
import { ProductsEntity } from './entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { ColorEntity } from './entities/colors.entity';
import { ProductCategoryEntity } from '../category/entities/productCategory.entity';
import { CreateColorDto } from './dto/createColor.dto';
import { ProductsOrderEnum } from '../../helpers/constants/productsOrder.enum';
import { OrderType } from 'src/helpers/constants';
import { GetProductsDto, GetProductsQuery } from './dto/getProducts.query';
import { ReviewsEntity } from '../reviews/entities/reviews.entity';
import { GetOneProductResponse } from './responses/getOneProductResponse';
import { TagsService } from '../tags/tags.service';
import { CreateTagDto } from '../tags/dto/createTag.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductCategoryEntity)
    private productCategoryRepository: Repository<ProductCategoryEntity>,
    @InjectRepository(ColorEntity)
    private colorRepository: Repository<ColorEntity>,
    private mediaService: MediaService,
    @InjectRepository(ReviewsEntity)
    private reviewsRepository: Repository<ReviewsEntity>,
    private tagsService: TagsService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<CreateProductResponse> {
    this.logger.log(`Создание продукта с названием: ${dto.title}`);

    const existingProduct = await this.productRepository.findOne({
      where: { title: dto.title },
    });

    if (existingProduct) {
      this.logger.error(`Продукт с названием ${dto.title} уже существует`);
      throw new ConflictException(
        `Product with title ${dto.title} already exists`,
      );
    }

    const newProduct = this.productRepository.create({
      title: dto.title,
      stockStatus: dto.stockStatus,
      oldPrice: dto.oldPrice,
      price: dto.price,
      quantity: dto.quantity,
      detailsDesc: dto.detailsDesc,
      dimensions: dto.dimensions,
    });

    await this.productRepository.save(newProduct);

    this.logger.log(`Продукт успешно создан с ID: ${newProduct.id}`);
    console.log(dto.categoryIds);
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const existingCategories = await this.productCategoryRepository.find({
        where: {
          productId: newProduct.id,
          categoryId: In(dto.categoryIds),
        },
      });

      const existingCategoryIds = existingCategories.map((cat) => cat.id);
      const newCategoryIds = dto.categoryIds.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId),
      );

      if (newCategoryIds.length > 0) {
        const productCategories = newCategoryIds.map((categoryId) =>
          this.productCategoryRepository.create({
            categoryId: categoryId,
            productId: newProduct.id,
          }),
        );

        await this.productCategoryRepository.save(productCategories);
      }
    }

    if (dto.colors && dto.colors.length > 0) {
      await this.createProductColors(newProduct.id, dto.colors);
    }

    this.logger.log(`Продукт успешно создан: ${newProduct.id}`);
    return { message: 'Продукт успешно создан', product: newProduct };
  }

  async getProducts(
    query?: GetProductsQuery,
    dto?: GetProductsDto,
  ): Promise<GetProductsResponse> {
    const {
      page = 1,
      take = 10,
      q = '',
      orderBy = ProductsOrderEnum.createdAt,
      order = OrderType.DESC,
    } = query;

    this.logger.log('Получение списка всех продуктов');

    const productQuery = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.colors', 'colors')
      .leftJoinAndSelect('products.medias', 'medias')
      .leftJoinAndSelect('products.productCategory', 'productCategory')
      .leftJoinAndSelect('products.tags', 'tags')
      .where('products.stockStatus = true');

    if (q) {
      productQuery.andWhere('products.title ILIKE :q', { q: `%${q}%` });
    }

    if (query.minPrice && query.maxPrice) {
      productQuery.andWhere('products.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      });
    }

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      productQuery.andWhere('productCategory.categoryId IN (:...categoryIds)', {
        categoryIds: dto.categoryIds,
      });
    }

    if (dto.color) {
      productQuery.andWhere('colors.title IN (:...color)', {
        color: dto.color,
      });
    }

    if (query.tag) {
      productQuery.andWhere('tags.tag ILIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    const [products, totalCount] = await productQuery
      .orderBy(`products.${orderBy}`, order)
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    this.logger.log(`Получено ${products.length} продуктов`);
    return { totalCount, products };
  }

  async getOneProduct(productId: string): Promise<GetOneProductResponse> {
    this.logger.log(`Получение продукта с ID: ${productId}`);
    const product = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.colors', 'colors')
      .leftJoinAndSelect('products.medias', 'medias')
      .leftJoinAndSelect('products.tags', 'tags')
      .where('products.id = :productId', { productId })
      .getOne();

    const productReviewMiddleStar = await this.reviewsRepository.average(
      'star',
      { productId: productId },
    );
    this.logger.log(`Продукт с ID: ${productId} успешно получен`);
    return { product, productReviewMiddleStar };
  }

  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    this.logger.log(`Обновление продукта с ID: ${productId}`);
    const product = await this.findProductById(productId);

    await this.productRepository.update(
      { id: product.id },
      {
        title: dto.title,
        stockStatus: dto.stockStatus,
        oldPrice: dto.oldPrice,
        price: dto.price,
        quantity: dto.quantity,
        detailsDesc: dto.detailsDesc,
        dimensions: dto.dimensions,
      },
    );

    await this.productCategoryRepository.delete({ productId: product.id });
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const existingCategories = await this.productCategoryRepository.find({
        where: {
          productId: product.id,
          categoryId: In(dto.categoryIds),
        },
      });

      const existingCategoryIds = existingCategories.map((cat) => cat.id);
      const newCategoryIds = dto.categoryIds.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId),
      );

      if (newCategoryIds.length > 0) {
        const productCategories = newCategoryIds.map((categoryId) =>
          this.productCategoryRepository.create({
            categoryId: categoryId,
            productId: product.id,
          }),
        );

        await this.productCategoryRepository.save(productCategories);
      }
    }

    await this.colorRepository.delete({ productId: product.id });
    if (dto.colors && dto.colors.length > 0) {
      await this.createProductColors(product.id, dto.colors);
    }

    this.logger.log(`Продукт с ID: ${product.id} успешно обновлен`);
    return { message: 'Продукт успешно обновлен', product };
  }

  async deleteProduct(productId: string): Promise<SuccessMessageType> {
    this.logger.log(`Удаление продукта с ID: ${productId}`);
    const product = await this.findProductById(productId);
    const productImageIds = product.medias.map((media) => {
      return media.id;
    });
    await this.mediaService.deleteMedias(productImageIds);
    await this.productRepository.delete({ id: product.id });
    this.logger.log(`Продукт с ID: ${productId} успешно удален`);
    return { message: 'Продукт успешно удален' };
  }

  async createProductColor(
    productId: string,
    colorDto: CreateColorDto,
  ): Promise<CreateProductColorResponse> {
    this.logger.log(`Добавление цвета к продукту с ID: ${productId}`);
    const color = this.colorRepository.create({
      ...colorDto,
      productId: productId,
    });
    await this.colorRepository.save(color);

    this.logger.log(`Цвет успешно добавлен к продукту с ID: ${color.id}`);
    return { message: 'Цвет продукта успешно добавлен', color };
  }

  async deleteProductColor(
    productId: string,
    colorId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Удаление цвета с ID: ${colorId} из продукта с ID: ${productId}`,
    );
    const result: DeleteResult = await this.colorRepository.delete({
      productId,
      id: colorId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Color with id ${colorId} not found for product with id ${productId}`,
      );
    }

    this.logger.log(`Цвет продукта успешно удален: ${colorId}`);
    return { message: 'Цвет продукта успешно удален' };
  }

  async createProductCategory(
    productId: string,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Добавление категории с ID: ${categoryId} к продукту с ID: ${productId}`,
    );
    const category = this.productCategoryRepository.create({
      productId,
      categoryId,
    });
    await this.categoryRepository.save(category);

    this.logger.log(`Категория успешно добавлена к продукту: ${categoryId}`);
    return { message: 'Категория продукта успешно добавлена' };
  }

  async deleteProductCategory(
    productId: string,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Удаление категории с ID: ${categoryId} из продукта с ID: ${productId}`,
    );
    const result = await this.productCategoryRepository.delete({
      categoryId,
      productId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Category with id ${categoryId} not found for product with id ${productId}`,
      );
    }

    this.logger.log(`Категория продукта успешно удалена: ${categoryId}`);
    return { message: 'Категория продукта успешно удалена' };
  }

  async uploadImage(
    image: ITransformedFile,
    productId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Загрузка изображения для продукта с ID: ${productId}`);
    const product = await this.findProductById(productId);

    await this.mediaService.createFileMedia(image, product.id, 'productId');
    this.logger.log(
      `Изображение успешно загружено для продукта с ID: ${productId}`,
    );
    return { message: 'Изображение успешно загружено' };
  }

  async deleteImage(
    productId: string,
    imageId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Удаление изображения с ID: ${imageId} из продукта с ID: ${productId}`,
    );
    await this.findProductById(productId);
    await this.mediaService.deleteOneMedia(imageId);
    this.logger.log(`Изображение успешно удалено: ${imageId}`);
    return { message: 'Изображение успешно удалено' };
  }

  async getNewArrivedProducts() {
    this.logger.log('Получение новых поступлений');
    const products = await this.productRepository.find({
      relations: { colors: true, medias: true, tags: true },
      take: 4,
      order: { createdAt: 'desc' },
    });

    return products;
  }

  async createTag(
    dto: CreateTagDto,
    productId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Создание тега для продукта с ID: ${productId}`);
    const product = await this.findProductById(productId);
    await this.tagsService.createTag(dto.tag, product.id, 'productId');
    this.logger.log('Тег продукта успешно создан!');
    return { message: 'Тег продукта успешно создан!' };
  }

  async deleteTag(tagId: string): Promise<SuccessMessageType> {
    this.logger.log(`Удаление тега с ID: ${tagId}`);
    await this.tagsService.deleteTag(tagId);
    this.logger.log('Тег успешно удален!');
    return { message: 'Тег успешно удален!' };
  }

  private async findProductById(productId: string): Promise<ProductType> {
    this.logger.log(`Поиск продукта с ID: ${productId}`);
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { colors: true, medias: true },
    });
    if (!product) {
      this.logger.error(`Product with id ${productId} not found!`);
      throw new NotFoundException('Product with this id not found!');
    }
    return product;
  }

  private async createProductColors(
    productId: string,
    colors: CreateColorDto[],
  ) {
    this.logger.log(`Добавление цветов к продукту с ID: ${productId}`);
    const colorEntities = colors.map((color) => ({
      ...color,
      productId: productId,
    }));
    await this.colorRepository.save(colorEntities);
    this.logger.log(`Цвета успешно добавлены к продукту с ID: ${productId}`);
  }

  async getColors() {
    this.logger.log('Получение всех цветов');
    const colors = await this.colorRepository.find();
    return colors;
  }
}
