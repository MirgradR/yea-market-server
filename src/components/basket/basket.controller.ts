import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { UpdateBasketProductCountDto } from './dto/updateBasketProductCount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { Client } from 'src/common/decorators/isClient.decorator';
import { AddProductToBasketOperation } from './decorators/addProductToBasketOperation.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GetBasketProductsOperation } from './decorators/getBasketProductsOperation.decorator';
import { UpdateBasketProductCountOperation } from './decorators/updateBasketProductCountOperation.decorator';
import { RemoveProductFromBasketOperation } from './decorators/removeProductFromBasketOperation.decorator';
import { GetBasketProductsQuery } from './dto/getBasketProducts.query';
import { GetBasketProducts } from './responses/getBasketProducts.response';

@ApiTags('basket')
@ApiBearerAuth()
@Client()
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post('add-product/:productId')
  @AddProductToBasketOperation()
  async addProductToBasket(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.basketService.addProductToBasket(productId, currentUser);
  }

  @Get('products')
  @GetBasketProductsOperation()
  async getBasketProducts(
    @CurrentUser() currentUser: ClientTokenDto,
    @Query() query?: GetBasketProductsQuery,
  ):Promise<GetBasketProducts> {
    return this.basketService.getBasketProducts(currentUser, query);
  }

  @Patch('product-count/:basketProductId')
  @UpdateBasketProductCountOperation()
  async updateBasketProductCount(
    @Param('basketProductId', ParseUUIDPipe) basketProductId: string,
    @Body() dto: UpdateBasketProductCountDto,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.basketService.updateBasketProductCount(
      basketProductId,
      dto,
      currentUser,
    );
  }

  @Delete('remove-product/:basketProductId')
  @RemoveProductFromBasketOperation()
  async removeProductFromBasket(
    @Param('basketProductId', ParseUUIDPipe) basketProductId: string,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.basketService.removeProductFromBasket(
      basketProductId,
      currentUser,
    );
  }
}
