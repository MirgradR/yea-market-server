import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Validate } from 'class-validator';
import { ColorEntity } from 'src/components/product/entities/colors.entity';

export class ColorType extends ColorEntity {
  @ApiProperty({
    description: 'The unique identifier of the color',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({ description: 'Hex code', example: '#FF5733 ' })
  hexCode: string;

  @ApiProperty({ description: 'Color title', example: 'Orange' })
  title: string;

  @Exclude()
  productId: string;
}
