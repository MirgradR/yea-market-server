import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { BasketProductsEntity } from './entities/basketProducts.entity';
import { ProductCommonModule } from '../productCommon/productCommon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BasketEntity, BasketProductsEntity]),
    ProductCommonModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
