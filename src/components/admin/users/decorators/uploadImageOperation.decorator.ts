import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage, FileFastifyInterceptor } from 'fastify-file-interceptor';
import { imageFilter } from 'src/common/filters/imageFilter';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { FileDto } from 'src/helpers/dto/file.dto';

export function UploadImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload admin user image' }),
    UseInterceptors(
      FileFastifyInterceptor('image', {
        storage: diskStorage({
          destination: './temp',
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
