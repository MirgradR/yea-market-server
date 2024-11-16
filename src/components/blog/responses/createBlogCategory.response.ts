import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { BlogCategoryType } from 'src/helpers/types/blogCategory.type';

export class CreateBlogCategoryResponse extends PickType(SuccessResponse, [
  'message',
]) {
  @Type(() => BlogCategoryType)
  @ApiProperty({ type: BlogCategoryType })
  blogCategory: BlogCategoryType;
}
