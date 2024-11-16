import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProductsEntity } from './orderProducts.entity';
import { OrderStatusEnum } from 'src/helpers/constants/orderStatus.enum';
import { UsersEntity } from 'src/components/client/users/entities/user.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.toProcess,
  })
  status?: OrderStatusEnum;

  @Column()
  company?: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode?: string;

  @Column()
  phoneNumber: string;

  @Column()
  email?: string;

  @Column()
  note?: string;

  @Column({ nullable: true })
  subTotal?: number;

  @Column({ nullable: true })
  totalPrice?: number;

  @Column()
  shippingCost: number;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  deliveredAt: Date;

  @OneToMany(
    () => OrderProductsEntity,
    (orderProducts) => orderProducts.order,
    { onUpdate: 'NO ACTION' },
  )
  orderProducts: OrderProductsEntity[];

  @ManyToOne(() => UsersEntity, (user) => user.orders)
  user: UsersEntity;
}
