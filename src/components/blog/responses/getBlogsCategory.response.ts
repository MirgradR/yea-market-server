import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlogCategoryType } from 'src/helpers/types/blogCategory.type';

export class GetBlogCategoriesResponse {
  @Type(() => BlogCategoryType)
  @ApiProperty({ type: [BlogCategoryType] })
  blogCategories: BlogCategoryType[];

  @ApiProperty({ description: 'Blog categories count' })
  totalCount: number;
}
