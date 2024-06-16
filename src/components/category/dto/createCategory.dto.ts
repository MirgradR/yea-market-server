import { PickType } from '@nestjs/swagger';
import { CategoryDto } from 'src/helpers/dto/category.dto';

export class CreateCategoryDto extends PickType(CategoryDto, ['title']) {}
