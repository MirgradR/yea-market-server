import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { BlogType } from 'src/helpers/types/blog.type';

export class UpdateBlogResponse extends PickType(SuccessResponse, ['message']) {
  @ApiProperty({ type: BlogType })
  @Type(() => BlogType)
  blog: BlogType;
}
