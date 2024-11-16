import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ClientTokensEntity } from '../../token/entities/token.entity';
import { FavoriteProductsEntity } from 'src/components/favorites/entities/favoriteProduct.entity';
import { ReviewsEntity } from 'src/components/reviews/entities/reviews.entity';
import { BasketEntity } from 'src/components/basket/entities/basket.entity';
import { OrderEntity } from 'src/components/orders/entities/order.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  company: string;

  @Column({ name: 'country_region' })
  countryRegion: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @OneToOne(() => ClientTokensEntity, (token) => token.user)
  @JoinColumn()
  token?: ClientTokensEntity;

  @OneToMany(
    () => FavoriteProductsEntity,
    (favoriteProduct) => favoriteProduct.user,
  )
  favoriteProducts?: FavoriteProductsEntity[];

  @OneToMany(() => ReviewsEntity, (reviews) => reviews.user)
  reviews?: ReviewsEntity[];

  @OneToOne(() => BasketEntity, (basket) => basket.user)
  @JoinColumn()
  basket?: BasketEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
