import { UsersEntity } from 'src/components/client/users/entities/user.entity';
import { ProductsEntity } from 'src/components/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_reviews' })
export class ReviewsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  star: number;

  @Column()
  comment?: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => ProductsEntity, (product) => product.reviews)
  product: ProductsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.reviews)
  user: UsersEntity;
}
