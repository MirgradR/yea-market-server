import { ApiProperty } from '@nestjs/swagger';
import { Colors } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ColorType implements Colors {
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
