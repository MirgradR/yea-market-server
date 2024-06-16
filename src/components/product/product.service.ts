import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ColorDto } from 'src/helpers/dto/color.dto';
import { MediaService } from 'src/libs/media/media.service';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { CreateProductResponse } from './responses/createProduct.response';
import { GetProductsResponse } from './responses/getProducts.response';
import { ProductType } from 'src/helpers/types/product.type';
import { UpdateProductResponse } from './responses/updateProduct.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CreateProductColorResponse } from './responses/createProductColor.response';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private prismaService: PrismaService,
    private mediaService: MediaService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<CreateProductResponse> {
    this.logger.log('Creating product with title: ' + dto.title);

    const existingProduct = await this.prismaService.products.findUnique({
      where: { title: dto.title },
    });

    if (existingProduct) {
      this.logger.error(`Product with title ${dto.title} already exists`);
      throw new ConflictException(
        `Product with title ${dto.title} already exists`,
      );
    }

    const newProduct = await this.prismaService.products.create({
      data: {
        title: dto.title,
        stockStatus: dto.stockStatus,
        oldPrice: dto.oldPrice,
        price: dto.price,
        quantity: dto.quantity,
        detailsDesc: dto.detailsDesc,
        dimensions: dto.dimensions,
        tags: dto.tags,
      },
    });

    this.logger.log(`Product created with ID: ${newProduct.id}`);

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const existingCategories =
        await this.prismaService.productCategory.findMany({
          where: {
            productId: newProduct.id,
            categoryId: { in: dto.categoryIds },
          },
        });

      const existingCategoryIds = existingCategories.map(
        (cat) => cat.categoryId,
      );
      const newCategoryIds = dto.categoryIds.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId),
      );

      if (newCategoryIds.length > 0) {
        await this.prismaService.productCategory.createMany({
          data: newCategoryIds.map((categoryId) => ({
            productId: newProduct.id,
            categoryId,
          })),
        });
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
    const products = await this.prismaService.products.findMany();
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

    const updatedProduct = await this.prismaService.products.update({
      where: { id: product.id },
      data: {
        title: dto.title,
        stockStatus: dto.stockStatus,
        oldPrice: dto.oldPrice,
        price: dto.price,
        quantity: dto.quantity,
        detailsDesc: dto.detailsDesc,
        dimensions: dto.dimensions,
        tags: dto.tags,
      },
    });

    await this.prismaService.productCategory.deleteMany({
      where: { productId: updatedProduct.id },
    });
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      await this.prismaService.productCategory.createMany({
        data: dto.categoryIds.map((categoryId) => ({
          productId: updatedProduct.id,
          categoryId,
        })),
      });
    }

    await this.prismaService.colors.deleteMany({
      where: { productId: updatedProduct.id },
    });
    if (dto.colors && dto.colors.length > 0) {
      await this.createProductColors(updatedProduct.id, dto.colors);
    }

    this.logger.log(`Product updated successfully: ${updatedProduct.id}`);
    return { message: 'Product updated successfully', product: updatedProduct };
  }

  async deleteProduct(productId: string): Promise<SuccessMessageType> {
    this.logger.log('Deleting product with ID: ' + productId);
    const product = await this.findProductById(productId);
    await this.prismaService.products.delete({ where: { id: product.id } });
    this.logger.log(`Product deleted successfully: ${productId}`);
    return { message: 'Product deleted successfully' };
  }

  async createProductColor(
    productId: string,
    colorDto: ColorDto,
  ): Promise<CreateProductColorResponse> {
    this.logger.log(`Adding color to product with ID: ${productId}`);
    const color = await this.prismaService.colors.create({
      data: { ...colorDto, productId: productId },
    });

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
    await this.prismaService.colors.delete({
      where: { productId, id: colorId },
    });

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
    await this.prismaService.productCategory.create({
      data: { productId, categoryId },
    });

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
    await this.prismaService.productCategory.deleteMany({
      where: { productId, categoryId },
    });

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
    const product = await this.prismaService.products.findUnique({
      where: { id: productId },
    });
    if (!product) {
      this.logger.error('Product with this ID not found: ' + productId);
      throw new NotFoundException('Product with this id not found');
    }
    return product;
  }

  private async createProductColors(productId: string, colors: ColorDto[]) {
    this.logger.log(`Adding colors to product with ID: ${productId}`);
    await this.prismaService.colors.createMany({
      data: colors.map((color) => ({
        productId: productId,
        title: color.title,
        hexCode: color.hexCode,
      })),
    });
    this.logger.log(`Colors added to product ID: ${productId}`);
  }
}
