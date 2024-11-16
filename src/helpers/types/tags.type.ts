import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TagsType {
  @ApiProperty({
    description: 'Уникальный идентификатор тега',
    example: 'b3b7d8b0-7a2d-11ec-9f1a-0242ac120002',
  })
  id: string;

  @ApiProperty({
    description: 'Название тега',
    example: 'Electronics',
  })
  tag: string;

  @Exclude()
  blogId?: string;

  @Exclude()
  productId?: string;
}
