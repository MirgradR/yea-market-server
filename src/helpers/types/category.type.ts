import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class CategoryType implements Categories {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the category',
    example: 'Electronics',
  })
  title: string;

  @ApiProperty({
    description: 'Date and time when the category was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
