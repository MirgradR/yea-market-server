import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MediaModule } from 'src/libs/media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { ColorEntity } from './entities/colors.entity';
import { ProductCategoryEntity } from '../category/entities/productCategory.entity';
import { ReviewsEntity } from '../reviews/entities/reviews.entity';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MediaModule,
    TypeOrmModule.forFeature([
      ProductsEntity,
      CategoryEntity,
      ColorEntity,
      ReviewsEntity,
      ProductCategoryEntity,
    ]),
    TagsModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
