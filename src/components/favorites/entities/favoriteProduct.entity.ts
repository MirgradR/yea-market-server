import { UsersEntity } from 'src/components/client/users/entities/user.entity';
import { ProductsEntity } from 'src/components/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'favorite_products' })
export class FavoriteProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => ProductsEntity, (product) => product.favoriteProducts)
  product: ProductsEntity;

  @ManyToOne(() => UsersEntity, (user) => user.favoriteProducts)
  user: UsersEntity;
}
