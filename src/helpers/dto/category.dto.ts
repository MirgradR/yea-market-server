import { PickType } from '@nestjs/swagger';
import { CategoryType } from '../types/category.type';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto extends PickType(CategoryType, ['title'] as const) {
  @IsNotEmpty()
  @IsString()
  title: string;
}
