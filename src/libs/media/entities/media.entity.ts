import { AdminsEntity } from 'src/components/admin/users/entities/admin.entity';
import { ProductsEntity } from 'src/components/product/entities/product.entity';
import { FileTypeEnum } from 'src/helpers/constants/fileType.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BlogsEntity } from 'src/components/blog/entities/blog.entity';

@Entity('medias')
export class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the media',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @Column({ name: 'file_name' })
  @ApiProperty({
    description: 'Name of the file',
    example: 'example-image.jpg',
    type: String,
  })
  fileName: string;

  @Column({ name: 'file_path' })
  @ApiProperty({
    description: 'Path where the file is stored',
    example: '/uploads/example-image.jpg',
    type: String,
  })
  filePath: string;

  @Column()
  @ApiProperty({
    description: 'Size of the file',
    example: '1024 KB',
    type: String,
  })
  size: string;

  @Column({ name: 'mime_type' })
  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
    type: String,
  })
  mimeType: string;

  @Column({ name: 'original_name' })
  @ApiProperty({
    description: 'Original name of the file',
    example: 'example-image.jpg',
    type: String,
  })
  originalName: string;

  @Column({ name: 'admin_id', nullable: true })
  @ApiProperty({
    description: 'Identifier of the admin user associated with the media',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
    required: false,
  })
  adminId: string;

  @Column({ name: 'product_id', nullable: true })
  @ApiProperty({
    description: 'Identifier of the product associated with the media',
    example: '123e4567-e89b-12d3-a456-426614174002',
    type: String,
    required: false,
  })
  productId: string;

  @Column({ name: 'blog_id', nullable: true })
  @ApiProperty({
    description: 'Identifier of the blog associated with the media',
    example: '123e4567-e89b-12d3-a456-426614174002',
    type: String,
    required: false,
  })
  blogId: string;

  @Column({
    type: 'enum',
    enum: FileTypeEnum,
    name: 'file_type',
  })
  @ApiProperty({
    description: 'Type of the file',
    example: FileTypeEnum.IMAGE,
  })
  fileType: FileTypeEnum;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({
    description: 'Date when the media was created',
    example: '2024-06-20T12:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({
    description: 'Date when the media was last updated',
    example: '2024-06-21T09:30:00Z',
    type: Date,
  })
  updatedAt: Date;

  @ManyToOne(() => AdminsEntity, (admin) => admin.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: AdminsEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.medias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;

  @ManyToOne(() => BlogsEntity, (blog) => blog.medias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog: BlogsEntity;
}
