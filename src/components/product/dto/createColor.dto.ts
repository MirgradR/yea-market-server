import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColorDto {
  @ApiProperty({ description: 'Hex code', example: '#FF5733' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  hexCode?: string;

  @ApiProperty({ description: 'Color title', example: 'Orange' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;
}
