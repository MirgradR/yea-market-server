import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BlogType } from './blog.type';

export class BlogCategoryType {
  @ApiProperty({
    description: 'Уникальный идентификатор категории блога',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  })
  id: string;

  @ApiProperty({
    description: 'Название категории блога',
    example: 'Технологии',
  })
  title: string;

  @ApiProperty({
    description: 'Список блогов, относящихся к данной категории',
    type: () => [BlogType],
  })
  @Type(() => BlogType)
  blogs: BlogType[];
}
