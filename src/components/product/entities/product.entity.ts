import { MediaEntity } from 'src/libs/media/entities/media.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ColorEntity } from './colors.entity';
import { ProductCategoryEntity } from 'src/components/category/entities/productCategory.entity';

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

  @Column('simple-array')
  tags: string[];

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
}
