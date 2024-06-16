import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoryType } from 'src/helpers/types/category.type';

export class GetCategoriesResponse {
  @ApiProperty({ type: [CategoryType] })
  @Type(() => CategoryType)
  categories: CategoryType[];

  @ApiProperty({ type: Number, description: 'Categories count' })
  totalCount: number;
}
