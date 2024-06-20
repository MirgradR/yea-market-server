import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { GetCategoriesQuery } from './dto/getCategories.query';
import { CreateCategoryResponse } from './responses/createCategory.response';
import { GetCategoriesResponse } from './responses/getCategories.response';
import { CategoryType } from 'src/helpers/types/category.type';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(
    dto: CreateCategoryDto,
  ): Promise<CreateCategoryResponse> {
    this.logger.log(`Создание категории с названием ${dto.title}`);

    const existingCategory = await this.categoryRepository.findOne({
      where: { title: dto.title },
    });

    if (existingCategory) {
      this.logger.error(`Категория с названием ${dto.title} уже существует`);
      throw new ConflictException(
        `Категория с названием ${dto.title} уже существует`,
      );
    }

    const newCategory = this.categoryRepository.create(dto);
    await this.categoryRepository.save(newCategory);

    this.logger.log(`Категория ${dto.title} успешно создана`);
    return { message: 'Категория успешно создана', category: newCategory };
  }

  async getCategories(
    query?: GetCategoriesQuery,
  ): Promise<GetCategoriesResponse> {
    this.logger.log('Получение списка категорий');

    const { page = 1, take = 10 } = query;
    const [categories, totalCount] = await this.categoryRepository.findAndCount(
      {
        take: take,
        skip: (page - 1) * take,
      },
    );

    this.logger.log('Список категорий успешно получен');
    return { totalCount, categories };
  }

  async getOneCategory(categoryId: string): Promise<CategoryType> {
    this.logger.log(`Получение категории с ID ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    this.logger.log(`Категория с ID ${categoryId} получена`);
    return category;
  }

  async updateCategory(
    dto: UpdateCategoryDto,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Обновление категории с ID ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    await this.categoryRepository.update(category.id, dto);

    this.logger.log(`Категория с ID ${categoryId} успешно обновлена`);
    return { message: 'Категория успешно обновлена' };
  }

  async deleteCategory(categoryId: string): Promise<SuccessMessageType> {
    this.logger.log(`Удаление категории с ID ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    await this.categoryRepository.delete(category.id);

    this.logger.log(`Категория с ID ${categoryId} успешно удалена`);
    return { message: 'Категория успешно удалена' };
  }

  private async findCategoryById(categoryId: string): Promise<CategoryType> {
    this.logger.log(`Поиск категории с ID ${categoryId}`);

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      this.logger.error(`Категория с ID ${categoryId} не найдена`);
      throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
    }

    this.logger.log(`Категория с ID ${categoryId} найдена`);
    return category;
  }
}
