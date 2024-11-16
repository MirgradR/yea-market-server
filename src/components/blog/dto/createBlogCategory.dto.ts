import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BlogCategoryType } from 'src/helpers/types/blogCategory.type';

export class CreateBlogCategoryDto extends PickType(BlogCategoryType, [
  'title',
] as const) {
  @IsString()
  @IsNotEmpty()
  title: string;
}
