import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ProductCommonModule } from '../productCommon/productCommon.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ProductCommonModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
