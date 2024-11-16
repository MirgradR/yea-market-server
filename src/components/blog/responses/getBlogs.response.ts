import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlogType } from 'src/helpers/types/blog.type';

export class GetBlogsResponse {
  @Type(() => BlogType)
  @ApiProperty({ type: [BlogType] })
  blogs: BlogType[];

  @ApiProperty({ description: 'Blogs count' })
  totalCount: number;
}
