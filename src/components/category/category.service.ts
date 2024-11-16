import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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
    this.logger.log(`Creating category with title ${dto.title}`);

    const existingCategory = await this.categoryRepository.findOne({
      where: { title: dto.title },
    });

    if (existingCategory) {
      this.logger.error(`Category with title ${dto.title} already exists`);
      throw new ConflictException(
        `Category with title ${dto.title} already exists`,
      );
    }

    const newCategory = this.categoryRepository.create(dto);
    await this.categoryRepository.save(newCategory);

    this.logger.log(`Category ${dto.title} created successfully`);
    return { message: 'Category created successfully', category: newCategory };
  }

  async getCategories(
    query?: GetCategoriesQuery,
  ): Promise<GetCategoriesResponse> {
    this.logger.log('Fetching list of categories');

    const { page = 1, take = 10 } = query;
    const [categories, totalCount] = await this.categoryRepository.findAndCount(
      {
        take: take,
        skip: (page - 1) * take,
      },
    );

    this.logger.log('List of categories fetched successfully');
    return { totalCount, categories };
  }

  async getOneCategory(categoryId: string): Promise<CategoryType> {
    this.logger.log(`Fetching category with ID ${categoryId}`);

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: {
        productCategory: { product: { colors: true, medias: true } },
      },
    });

    if (!category) {
      this.logger.error(`Category with ID ${categoryId} not found`);
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    this.logger.log(`Category with ID ${categoryId} fetched`);
    return category;
  }

  async updateCategory(
    dto: UpdateCategoryDto,
    categoryId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Updating category with ID ${categoryId}`);
    const candidate = await this.categoryRepository.findOne({
      where: { title: dto.title, id: Not(categoryId) },
    });
    if (candidate)
      throw new ConflictException('Category with this title already exists');
    const category = await this.findCategoryById(categoryId);

    await this.categoryRepository.update(category.id, dto);

    this.logger.log(`Category with ID ${categoryId} updated successfully`);
    return { message: 'Category updated successfully' };
  }

  async deleteCategory(categoryId: string): Promise<SuccessMessageType> {
    this.logger.log(`Deleting category with ID ${categoryId}`);

    const category = await this.findCategoryById(categoryId);

    await this.categoryRepository.delete(category.id);

    this.logger.log(`Category with ID ${categoryId} deleted successfully`);
    return { message: 'Category deleted successfully' };
  }

  private async findCategoryById(categoryId: string): Promise<CategoryType> {
    this.logger.log(`Finding category with ID ${categoryId}`);

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      this.logger.error(`Category with ID ${categoryId} not found`);
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    this.logger.log(`Category with ID ${categoryId} found`);
    return category;
  }
}
