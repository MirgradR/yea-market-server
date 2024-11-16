import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogsEntity } from './blog.entity';

@Entity({ name: 'blog_categories' })
export class BlogCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => BlogsEntity, (blogs) => blogs.blogCategory)
  blogs: BlogsEntity[];
}
