import { BlogsEntity } from 'src/components/blog/entities/blog.entity';
import { ProductsEntity } from 'src/components/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tags' })
export class TagsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tag: string;

  @Column({ type: 'uuid', nullable: true })
  blogId?: string;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;

  @ManyToOne(() => BlogsEntity, (blog) => blog.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: BlogsEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductsEntity;
}
