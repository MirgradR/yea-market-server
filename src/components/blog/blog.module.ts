import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogCategoryEntity } from './entities/blogCategory.entity';
import { BlogsEntity } from './entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from 'src/libs/media/media.module';
import { MinioModule } from 'src/libs/minio/minio.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategoryEntity, BlogsEntity]),
    MediaModule,
    MinioModule,
    TagsModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
