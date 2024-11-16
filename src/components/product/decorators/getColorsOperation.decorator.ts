import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ColorType } from 'src/helpers/types/color.type';

export function GetColorsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get colors' }),
    ApiOkResponse({ type: [ColorType] }),
  );
}
