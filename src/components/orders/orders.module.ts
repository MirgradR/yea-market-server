import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductsEntity } from './entities/orderProducts.entity';
import { OrderEntity } from './entities/order.entity';
import { ProductCommonModule } from '../productCommon/productCommon.module';
import { BasketEntity } from '../basket/entities/basket.entity';
import { BasketProductsEntity } from '../basket/entities/basketProducts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderProductsEntity,
      BasketEntity,
      BasketProductsEntity,
    ]),
    ProductCommonModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
