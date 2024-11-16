import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BlogType } from 'src/helpers/types/blog.type';

export class CreateBlogDto extends PickType(BlogType, [
  'author',
  'description',
  'title',
]) {
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
