import { UsersEntity } from 'src/components/client/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BasketProductsEntity } from './basketProducts.entity';

@Entity({ name: 'basket' })
export class BasketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => UsersEntity, (user) => user.basket)
  user: UsersEntity;

  @OneToMany(
    () => BasketProductsEntity,
    (basketProducts) => basketProducts.product,
  )
  basketProducts: BasketProductsEntity[];
}
