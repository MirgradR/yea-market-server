import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/libs/media/media.service';

@Injectable()
export class ProductCommonService {
  private logger = new Logger(ProductCommonService.name);
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    private mediaService: MediaService,
  ) {}

  async findProductById(productId: string) {
    this.logger.log('Поиск товара по id');
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      this.logger.error('Товар с этим id не найден');
      throw new NotFoundException('Product not found!');
    }
    return product;
  }

  async deleteProductsByCategoryId(categoryId: string) {
    const products = await this.productRepository.find({
      where: { productCategory: { categoryId } },
      relations: { medias: true },
    });

    for (const product of products) {
      for (const productImage of product.medias) {
        await this.mediaService.deleteOneMedia(productImage.id);
      }
    }
    return { message: 'Products deleted' };
  }
}
