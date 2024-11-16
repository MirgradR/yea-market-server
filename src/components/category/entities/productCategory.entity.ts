import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductsEntity } from 'src/components/product/entities/product.entity';
import { CategoryEntity } from './category.entity';

@Entity('product_categories')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.productCategory)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.productCategory)
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;
}
