import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
