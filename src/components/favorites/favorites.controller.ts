import { Controller, Post, Delete, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { AddProductToFavoritesOperation } from './decorators/addProductToFavoritesOperation.decorator';
import { RemoveProductFromFavoritesOperation } from './decorators/removeProductFromFavoritesOperation.decorator';
import { Client } from 'src/common/decorators/isClient.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GetFavoriteProductsOperation } from './decorators/getFavoriteProductsOperation.decorator';
import { GetFavoriteProductsQuery } from './dto/getFavoriteProducts.query';
import { GetFavoriteProductsResponse } from './responses/getFavoriteProducts.response';

@ApiTags('favorites')
@ApiBearerAuth()
@Client()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  @AddProductToFavoritesOperation()
  async addProductToFavorites(
    @Param('productId') productId: string,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.favoritesService.addProductToFavorites(productId, currentUser);
  }

  @Get()
  @GetFavoriteProductsOperation()
  async getFavoriteProducts(
    @CurrentUser() currentUser: ClientTokenDto,
    @Query() query: GetFavoriteProductsQuery,
  ): Promise<GetFavoriteProductsResponse> {
    return this.favoritesService.getFavoriteProducts(currentUser, query);
  }

  @Delete(':favoriteProductId')
  @RemoveProductFromFavoritesOperation()
  async removeProductFromFavorites(
    @Param('favoriteProductId') favoriteProductId: string,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.favoritesService.removeProductFromFavorites(
      favoriteProductId,
      currentUser,
    );
  }
}
