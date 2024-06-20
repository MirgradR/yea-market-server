import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MinioService } from '../../libs/minio/minio.service';
import { ITransformedFile } from '../../helpers/interfaces/fileTransform.interface';
import { In, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private minioService: MinioService,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
  ) {}

  async createFilesMedia(
    files: ITransformedFile[],
    entityId: string,
    entityColumn: string,
  ) {
    const mediaIds = [];

    for (const file of files) {
      const mediaData: any = {
        originalName: file.originalName,
        fileName: file.fileName,
        filePath: file.filePath,
        mimeType: file.mimeType,
        size: file.size,
        fileType: file.fileType,
      };
      mediaData[entityColumn] = entityId;

      const media = this.mediaRepository.create({
        originalName: mediaData.originalName,
        fileName: mediaData.fileName,
        filePath: mediaData.filePath,
        mimeType: mediaData.mimeType,
        size: mediaData.size,
        fileType: mediaData.fileType,
        [entityColumn]: entityId,
      });
      await this.mediaRepository.save(media);

      mediaIds.push(media.id);
    }

    return mediaIds;
  }

  async createFileMedia(
    file: ITransformedFile,
    entityId: string,
    entityColumn: string,
  ) {
    const mediaData: any = {
      originalName: file.originalName,
      fileName: file.fileName,
      filePath: file.filePath,
      mimeType: file.mimeType,
      size: file.size,
      fileType: file.fileType,
    };
    mediaData[entityColumn] = entityId;

    const media = this.mediaRepository.create({
      originalName: mediaData.originalName,
      fileName: mediaData.fileName,
      filePath: mediaData.filePath,
      mimeType: mediaData.mimeType,
      size: mediaData.size,
      fileType: mediaData.fileType,
      [entityColumn]: entityId,
    });
    await this.mediaRepository.save(media);

    return media.id;
  }

  async deleteMedias(fileIds: string[]) {
    this.logger.log(`Deleting media with IDs: ${fileIds.join(', ')}`);

    const mediaToDelete = await this.mediaRepository.find({
      where: { id: In(fileIds) },
    });
    if (mediaToDelete.length !== fileIds.length) {
      const foundIds = mediaToDelete.map((media) => media.id);
      const notFoundIds = fileIds.filter((id) => !foundIds.includes(id));
      this.logger.warn(`Some media files not found: ${notFoundIds.join(', ')}`);
      throw new NotFoundException('Some media files not found');
    }

    const fileNames = mediaToDelete.map((media) => media.fileName);
    await this.minioService.deleteFiles(fileNames);
    await this.mediaRepository.delete(mediaToDelete.map((media) => media.id));
  }

  async deleteOneMedia(mediaId: string) {
    this.logger.log(`Deleting media with ID: ${mediaId}`);

    const mediaToDelete = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!mediaToDelete) {
      this.logger.warn(`Media with ID ${mediaId} not found`);
      throw new NotFoundException('Media not found');
    }

    await this.minioService.deleteFile(mediaToDelete.fileName);
    await this.mediaRepository.delete(mediaId);
  }

  async getOneMedia(mediaId: string) {
    this.logger.log(`Fetching media with ID: ${mediaId}`);

    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!media) {
      this.logger.warn(`Media with ID ${mediaId} not found`);
      throw new NotFoundException('Media not found');
    }

    return media;
  }
}
