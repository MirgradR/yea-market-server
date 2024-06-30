import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsEntity } from './entities/tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
  ) {}

  async createTag(newTag: string, entityId: string, entityColumn: string) {
    this.logger.log(
      `Попытка создать тег '${newTag}' для ${entityColumn} с ID ${entityId}`,
    );

    const candidate = await this.tagsRepository.findOne({
      where: { tag: newTag, [entityColumn]: entityId },
    });
    if (candidate) {
      this.logger.error(
        `Тег '${newTag}' уже существует для ${entityColumn} с ID ${entityId}`,
      );
      throw new ConflictException('You already added this tag for this entity');
    }

    const tag = this.tagsRepository.create({
      tag: newTag,
      [entityColumn]: entityId,
    });
    await this.tagsRepository.save(tag);

    this.logger.log(
      `Тег '${newTag}' успешно создан для ${entityColumn} с ID ${entityId}`,
    );
    return { message: 'Tag created successfully' };
  }

  async deleteTag(tagId: string) {
    this.logger.log(`Попытка удалить тег с ID ${tagId}`);

    const tag = await this.findTagById(tagId);
    await this.tagsRepository.delete({ id: tag.id });

    this.logger.log(`Тег с ID ${tagId} успешно удален`);
    return { message: 'Tag deleted successfully!' };
  }

  async deleteTags(entityId: string, entityColumn: string) {
    await this.tagsRepository.delete({ [entityColumn]: entityId });
  }

  private async findTagById(tagId: string) {
    this.logger.log(`Поиск тега с ID ${tagId}`);

    const tag = await this.tagsRepository.findOne({ where: { id: tagId } });
    if (!tag) {
      this.logger.error(`Тег с ID ${tagId} не найден`);
      throw new NotFoundException('Tag not found!');
    }

    this.logger.log(`Тег с ID ${tagId} найден`);
    return tag;
  }
}
