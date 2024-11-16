import { MediaEntity } from 'src/libs/media/entities/media.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ColorEntity } from './colors.entity';
import { ProductCategoryEntity } from 'src/components/category/entities/productCategory.entity';
import { FavoriteProductsEntity } from 'src/components/favorites/entities/favoriteProduct.entity';
import { ReviewsEntity } from 'src/components/reviews/entities/reviews.entity';
import { BasketProductsEntity } from 'src/components/basket/entities/basketProducts.entity';
import { OrderProductsEntity } from 'src/components/orders/entities/orderProducts.entity';
import { TagsEntity } from 'src/components/tags/entities/tags.entity';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  stockStatus: boolean;

  @Column()
  oldPrice: number;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  detailsDesc: string;

  @Column()
  dimensions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.product,
  )
  productCategory: ProductCategoryEntity[];

  @OneToMany(() => ColorEntity, (color) => color.product)
  colors: ColorEntity[];

  @OneToMany(() => MediaEntity, (media) => media.product)
  medias: MediaEntity[];

  @OneToMany(
    () => FavoriteProductsEntity,
    (favoriteProduct) => favoriteProduct.product,
  )
  favoriteProducts?: FavoriteProductsEntity[];

  @OneToMany(() => ReviewsEntity, (reviews) => reviews.product)
  reviews?: ReviewsEntity[];

  @OneToOne(() => OrderProductsEntity, (orderProduct) => orderProduct.product)
  orderProduct: OrderProductsEntity;

  @OneToOne(
    () => BasketProductsEntity,
    (basketProduct) => basketProduct.product,
  )
  basketProduct: BasketProductsEntity;

  @OneToMany(() => TagsEntity, (tags) => tags.product)
  tags: TagsEntity[];
}
