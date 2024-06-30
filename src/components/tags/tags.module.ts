import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagsEntity])],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
