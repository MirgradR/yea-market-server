import { ApiProperty } from '@nestjs/swagger';
import { FileTypeEnum } from '../constants/fileType.enum';
import { Exclude } from 'class-transformer';

export class MediaType {
  @ApiProperty({
    description: 'Unique identifier of the media',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name of the file',
    example: 'example-image.jpg',
    type: String,
  })
  fileName: string;

  @ApiProperty({
    description: 'Path where the file is stored',
    example: '/uploads/example-image.jpg',
    type: String,
  })
  filePath: string;

  @ApiProperty({
    description: 'Size of the file',
    example: '1024 KB',
    type: String,
  })
  size: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
    type: String,
  })
  mimeType: string;

  @ApiProperty({
    description: 'Original name of the file',
    example: 'example-image.jpg',
    type: String,
  })
  originalName: string;

  @Exclude()
  adminId: string;

  @Exclude()
  productId: string;

  @ApiProperty({
    description: 'Type of the file',
    example: FileTypeEnum.IMAGE,
  })
  fileType: FileTypeEnum;

  @ApiProperty({
    description: 'Date when the media was created',
    example: '2024-06-20T12:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the media was last updated',
    example: '2024-06-21T09:30:00Z',
    type: Date,
  })
  updatedAt: Date;
}
