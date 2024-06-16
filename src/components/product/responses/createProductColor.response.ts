import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { ColorType } from 'src/helpers/types/color.type';

export class CreateProductColorResponse extends PickType(SuccessResponse, [
  'message',
]) {
  @Type(() => ColorType)
  @ApiProperty({ type: ColorType })
  color: ColorType;
}
