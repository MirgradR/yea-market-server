import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { CategoryType } from 'src/helpers/types/category.type';

export class CreateCategoryResponse extends PickType(SuccessResponse, [
  'message',
] as const) {
  @ApiProperty({ type: CategoryType })
  @Type(() => CategoryType)
  category: CategoryType;
}
