import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { GetCategoriesQuery } from './dto/getCategories.query';
import { DeleteCategoryOperation } from './decorators/deleteCategoryOperation.decorator';
import { UpdateCategoryOperation } from './decorators/updateCategoryOperation.decorator';
import { CategoryType } from 'src/helpers/types/category.type';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { GetOneCategoryOperation } from './decorators/getOneCategoryOperation.decorator';
import { GetCategoriesOperation } from './decorators/getCategoriesOperation.decorator';
import { CreateCategoryOperation } from './decorators/createCategoryOperation.decorator';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CreateCategoryOperation()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get()
  @GetCategoriesOperation()
  async getCategories(@Query() query: GetCategoriesQuery) {
    return this.categoryService.getCategories(query);
  }

  @Get(':categoryId')
  @GetOneCategoryOperation()
  async getOneCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryType> {
    return this.categoryService.getOneCategory(categoryId);
  }

  @Patch(':categoryId')
  @UpdateCategoryOperation()
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<SuccessMessageType> {
    return this.categoryService.updateCategory(dto, categoryId);
  }

  @Delete(':categoryId')
  @DeleteCategoryOperation()
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<SuccessMessageType> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
