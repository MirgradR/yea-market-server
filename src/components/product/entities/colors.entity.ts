import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductsEntity } from './product.entity';

@Entity('colors')
export class ColorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  hexCode: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => ProductsEntity, (product) => product.colors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;
}
