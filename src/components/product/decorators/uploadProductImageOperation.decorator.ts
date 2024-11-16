import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { imageFilter } from 'src/common/filters/imageFilter';
import { randomUUID } from 'crypto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function UploadProductImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload an image for a product' }),
    ApiResponse({
      status: 200,
      description: 'Image uploaded successfully',
      type: SuccessMessageType,
    }),
    ApiResponse({ status: 404, description: 'Product with this ID not found' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
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
    Admin(),
  );
}
