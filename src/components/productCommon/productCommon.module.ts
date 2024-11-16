import { Module } from '@nestjs/common';
import { ProductCommonService } from './productCommon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from '../product/entities/product.entity';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity]), MediaModule],
  providers: [ProductCommonService],
  exports: [ProductCommonService],
})
export class ProductCommonModule {}
