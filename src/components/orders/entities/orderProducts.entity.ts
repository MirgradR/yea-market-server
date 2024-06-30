import { ProductsEntity } from 'src/components/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_products' })
export class OrderProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column()
  totalPrice: number;

  @OneToOne(() => ProductsEntity, (product) => product.orderProduct)
  @JoinColumn()
  product: ProductsEntity;

  @ManyToOne(() => OrderEntity, (order) => order.orderProducts, {
    onUpdate: 'NO ACTION',
  })
  order: OrderEntity;
}
