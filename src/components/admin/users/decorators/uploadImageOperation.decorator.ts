import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { imageFilter } from 'src/common/filters/imageFilter';
import { FileDto } from 'src/helpers/dto/file.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UploadImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload admin user image' }),
    UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, './src/temp');
          },
          filename: (req, file, cb) => {
            const fileExtension = file.mimetype.split('/')[1];
            const uniqueFileName = `${randomUUID()}.${fileExtension}`;
            cb(null, uniqueFileName);
          },
        }),
        limits: { fileSize: 1024 * 1024 * 1500 },
        fileFilter: imageFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: FileDto }),
    ApiResponse({
      status: 200,
      description: 'Image uploaded successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 400, description: 'Invalid image file' }),
  );
}
