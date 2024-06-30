import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProductsEntity } from './entities/favoriteProduct.entity';
import { ProductCommonModule } from '../productCommon/productCommon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteProductsEntity]),
    ProductCommonModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
