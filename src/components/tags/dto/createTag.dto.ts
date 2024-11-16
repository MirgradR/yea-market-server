import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag' })
  @IsNotEmpty()
  @IsString()
  tag: string;
}
