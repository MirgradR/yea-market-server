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
  ) {}

  async createProduct(dto: CreateProductDto): Promise<CreateProductResponse> {
    this.logger.log('Creating product with title: ' + dto.title);

    const existingProduct = await this.productRepository.findOne({
      where: { title: dto.title },
    });

    if (existingProduct) {
      this.logger.error(`Product with title ${dto.title} already exists`);
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
      tags: dto.tags,
    });

    await this.productRepository.save(newProduct);

    this.logger.log(`Product created with ID: ${newProduct.id}`);
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

    this.logger.log(`Product created successfully: ${newProduct.id}`);
    return { message: 'Product created successfully', product: newProduct };
  }

  async getProducts(): Promise<GetProductsResponse> {
    this.logger.log('Retrieving all products');
    const products = await this.productRepository.find({
      relations: { colors: true, medias: true },
    });
    this.logger.log(`Retrieved ${products.length} products`);
    return { products };
  }

  async getOneProduct(productId: string): Promise<ProductType> {
    this.logger.log('Retrieving product with ID: ' + productId);
    const product = await this.findProductById(productId);
    this.logger.log('Retrieved product: ' + productId);
    return product;
  }

  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    this.logger.log('Updating product with ID: ' + productId);
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
        tags: dto.tags,
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

    this.logger.log(`Product updated successfully: ${product.id}`);
    return { message: 'Product updated successfully', product };
  }

  async deleteProduct(productId: string): Promise<SuccessMessageType> {
    this.logger.log('Deleting product with ID: ' + productId);
    const product = await this.findProductById(productId);
    await this.productRepository.delete({ id: product.id });
    this.logger.log(`Product deleted successfully: ${productId}`);
    return { message: 'Product deleted successfully' };
  }

  async createProductColor(
    productId: string,
    colorDto: CreateColorDto,
  ): Promise<CreateProductColorResponse> {
    this.logger.log(`Adding color to product with ID: ${productId}`);
    const color = this.colorRepository.create({
      ...colorDto,
      productId: productId,
    });
    await this.colorRepository.save(color);

    this.logger.log(`Product color added successfully: ${color.id}`);
    return { message: 'Product color added successfully', color };
  }

  async deleteProductColor(
    productId: string,
    colorId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Deleting color with ID: ${colorId} from product with ID: ${productId}`,
    );
    const result: DeleteResult = await this.colorRepository.delete({
      productId,
      id: colorId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Color with ID ${colorId} not found for product ${productId}`,
      );
    }

    this.logger.log(`Product color deleted successfully: ${colorId}`);
    return { message: 'Product color deleted successfully' };
  }

  async createProductCategory(
    productId: string,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Adding category with ID: ${categoryId} to product with ID: ${productId}`,
    );
    const category = this.productCategoryRepository.create({
      productId,
      categoryId,
    });
    await this.categoryRepository.save(category);

    this.logger.log(`Product category added successfully: ${categoryId}`);
    return { message: 'Product category added successfully' };
  }

  async deleteProductCategory(
    productId: string,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Deleting category with ID: ${categoryId} from product with ID: ${productId}`,
    );
    const result = await this.productCategoryRepository.delete({
      categoryId,
      productId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Category with ID ${categoryId} not found for product ${productId}`,
      );
    }

    this.logger.log(`Product category deleted successfully: ${categoryId}`);
    return { message: 'Product category deleted successfully' };
  }

  async uploadImage(
    image: ITransformedFile,
    productId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Uploading image for product with ID: ${productId}`);
    const product = await this.findProductById(productId);

    await this.mediaService.createFileMedia(image, product.id, 'productId');
    this.logger.log(`Image uploaded successfully for product ID: ${productId}`);
    return { message: 'Image uploaded successfully' };
  }

  async deleteImage(
    productId: string,
    imageId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Deleting image with ID: ${imageId} from product with ID: ${productId}`,
    );
    await this.findProductById(productId);
    await this.mediaService.deleteOneMedia(imageId);
    this.logger.log(`Image deleted successfully: ${imageId}`);
    return { message: 'Image deleted successfully' };
  }

  private async findProductById(productId: string): Promise<ProductType> {
    this.logger.log('Finding product with ID: ' + productId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { colors: true, medias: true },
    });
    if (!product) {
      this.logger.error('Product with this ID not found: ' + productId);
      throw new NotFoundException('Product with this id not found');
    }
    return product;
  }

  private async createProductColors(
    productId: string,
    colors: CreateColorDto[],
  ) {
    this.logger.log(`Adding colors to product with ID: ${productId}`);
    const colorEntities = colors.map((color) => ({
      ...color,
      productId: productId,
    }));
    await this.colorRepository.save(colorEntities);
    this.logger.log(`Colors added to product ID: ${productId}`);
  }
}
