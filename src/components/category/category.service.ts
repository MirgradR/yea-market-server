import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { GetCategoriesQuery } from './dto/getCategories.query';
import { CreateCategoryResponse } from './responses/createCategory.response';
import { GetCategoriesResponse } from './responses/getCategories.response';
import { CategoryType } from 'src/helpers/types/category.type';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(private prismaService: PrismaService) {}

  async createCategory(
    dto: CreateCategoryDto,
  ): Promise<CreateCategoryResponse> {
    this.logger.log(`Попытка создания категории с названием ${dto.title}`);

    const candidate = await this.prismaService.categories.findFirst({
      where: { title: dto.title },
    });

    if (candidate) {
      this.logger.error(`Категория с названием ${dto.title} уже существует`);
      throw new ConflictException(
        `Категория с названием ${dto.title} уже существует`,
      );
    }

    const category = await this.prismaService.categories.create({
      data: { ...dto },
    });

    this.logger.log(`Категория ${dto.title} успешно создана`);
    return { message: 'Категория успешно создана', category };
  }

  async getCategories(
    query?: GetCategoriesQuery,
  ): Promise<GetCategoriesResponse> {
    this.logger.log('Запрос списка категорий');

    const { page = 1, take = 10 } = query;
    const categories = await this.prismaService.categories.findMany({
      take: take,
      skip: (page - 1) * take,
    });
    const totalCount = await this.prismaService.categories.count();

    this.logger.log('Список категорий успешно получен');
    return { totalCount, categories };
  }

  async getOneCategory(categoryId: string): Promise<CategoryType> {
    this.logger.log(`Запрос категории с id ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    this.logger.log(`Категория с id ${categoryId} найдена`);
    return category;
  }

  async updateCategory(
    dto: UpdateCategoryDto,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Попытка обновления категории с id ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    await this.prismaService.categories.update({
      where: { id: category.id },
      data: { ...dto },
    });

    this.logger.log(`Категория с id ${categoryId} успешно обновлена`);
    return { message: 'Категория успешно обновлена' };
  }

  async deleteCategory(categoryId: string): Promise<SuccessMessageType> {
    this.logger.log(`Попытка удаления категории с id ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    await this.prismaService.categories.delete({ where: { id: category.id } });

    this.logger.log(`Категория с id ${categoryId} успешно удалена`);
    return { message: 'Категория успешно удалена' };
  }

  private async findCategoryById(categoryId: string) {
    this.logger.log(`Поиск категории с id ${categoryId}`);

    const category = await this.prismaService.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      this.logger.error(`Категория с id ${categoryId} не найдена`);
      throw new NotFoundException('Категория с этим id не найдена');
    }

    this.logger.log(`Категория с id ${categoryId} найдена`);
    return category;
  }
}
