import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BlogCategoryType } from 'src/helpers/types/blogCategory.type';

export class GetOneBlogCategoryResponse {
  @Type(() => BlogCategoryType)
  @ApiProperty({ type: BlogCategoryType })
  blogCategory: BlogCategoryType;
}
