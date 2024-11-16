import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { imageFilter } from 'src/common/filters/imageFilter';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UploadBlogImageOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload an image for a blog' }),
    ApiConsumes('multipart/form-data'),
    ApiOkResponse({
      description: 'The image has been successfully uploaded.',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'Bad request.' }),
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
    ApiBearerAuth(),
  );
}
