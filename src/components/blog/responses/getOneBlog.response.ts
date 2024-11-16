import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlogType } from 'src/helpers/types/blog.type';

export class GetOneBlogResponse {
  @Type(() => BlogType)
  @ApiProperty({ type: BlogType })
  blog: BlogType;
}
