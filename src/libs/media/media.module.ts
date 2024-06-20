import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MinioService } from '../../libs/minio/minio.service';
import { MinioModule } from '../../libs/minio/minio.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';

@Module({
  imports: [MinioModule, TypeOrmModule.forFeature([MediaEntity])],
  providers: [MediaService, MinioService],
  exports: [MediaService, MinioService],
})
export class MediaModule {}
