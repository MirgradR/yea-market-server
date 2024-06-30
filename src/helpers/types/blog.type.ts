import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { MediaType } from './mediaType';
import { TagsType } from './tags.type';

export class BlogType {
  @ApiProperty({
    description: 'Уникальный идентификатор блога',
    example: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  })
  id: string;

  @ApiProperty({
    description: 'Автор блога',
    example: 'John Doe',
  })
  author: string;

  @Exclude()
  blogCategoryId: string;

  @ApiProperty({
    description: 'Описание блога',
    example: 'This is a blog about technology and its impacts on modern life.',
  })
  description: string;

  @ApiProperty({
    description: 'Заголовок блога',
    example: 'The Future of Technology',
  })
  title: string;

  @ApiProperty({
    description: 'Медиафайлы, связанные с блогом',
    type: () => [MediaType],
  })
  @Type(() => MediaType)
  medias: MediaType[];

  @ApiProperty({
    description: 'Теги, связанные с блогом',
    type: () => [TagsType],
  })
  @Type(() => TagsType)
  tags: TagsType[];
}
