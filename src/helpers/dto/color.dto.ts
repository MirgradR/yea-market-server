import { OmitType } from '@nestjs/swagger';
import { ColorType } from '../types/color.type';

export class ColorDto extends OmitType(ColorType, ['id'] as const) {}
