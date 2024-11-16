import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { MinioService } from '../../libs/minio/minio.service';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { ITransformedFile } from '../../helpers/interfaces/fileTransform.interface';
import { FileTypeEnum } from 'src/helpers/constants/fileType.enum';

@Injectable()
export class VideoTransformer implements PipeTransform<Express.Multer.File> {
  constructor(private readonly minioService: MinioService) {}

  async transform(file: Express.Multer.File): Promise<ITransformedFile> {
    let transformedFile: ITransformedFile;
    if (!file.path || !file.destination)
      throw new BadRequestException('Video not provided');
    try {
      const uploadStream = createReadStream(file.path);

      await this.minioService.uploadFileStream(
        file.filename,
        uploadStream,
        file.size,
        file.mimetype,
      );

      transformedFile = {
        fileName: file.filename,
        originalName: file.originalname,
        filePath: await this.minioService.getFileUrl(file.filename),
        mimeType: file.mimetype,
        size: file.size.toString(),
        fileType: FileTypeEnum.IMAGE,
      };
      await unlink(file.path);
      return transformedFile;
    } catch (err) {
      console.error(`Error processing file ${file.originalname}:`, err);
      await unlink(file.path);
      throw new InternalServerErrorException(
        'Failed to process some files. Please check server logs for details.',
      );
    }
  }
}
