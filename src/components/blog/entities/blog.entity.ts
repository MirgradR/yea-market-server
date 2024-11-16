import { MediaEntity } from 'src/libs/media/entities/media.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogCategoryEntity } from './blogCategory.entity';
import { TagsEntity } from 'src/components/tags/entities/tags.entity';

@Entity({ name: 'blogs' })
export class BlogsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column({ type: 'uuid' })
  blogCategoryId: string;

  @OneToMany(() => MediaEntity, (media) => media.blog)
  medias: MediaEntity[];

  @ManyToOne(() => BlogCategoryEntity, (blogCategory) => blogCategory.blogs)
  blogCategory: BlogCategoryEntity;

  @OneToMany(() => TagsEntity, (tags) => tags.blog)
  tags: TagsEntity[];
}
