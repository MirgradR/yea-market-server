import { ProductsEntity } from 'src/components/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BasketEntity } from './basket.entity';

@Entity({ name: 'basket_products' })
export class BasketProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @Column({ type: 'uuid' })
  basketId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @OneToOne(() => ProductsEntity, (product) => product.basketProduct)
  @JoinColumn()
  product: ProductsEntity;

  @ManyToOne(() => BasketEntity, (basket) => basket.basketProducts)
  basket: BasketEntity;
}
