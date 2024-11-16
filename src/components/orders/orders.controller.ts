import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { GetOrdersQuery } from './dto/getOrders.query';
import { CreateOrderOperation } from './decorators/createOrderOperation.decorator';
import { GetOrdersOperation } from './decorators/getOrdersOperation.decorator';
import { GetUserOrdersOperation } from './decorators/getUserOrdersOperation.decorator';
import { CancelOrderOperation } from './decorators/cancelOrderOperation.decorator';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UpdateOrderOperation } from './decorators/updateOrderOperation.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { GetOrdersResponse } from './responses/getOrders.response';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @CreateOrderOperation()
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.ordersService.createOrder(dto, currentUser);
  }

  @Delete(':orderId')
  @CancelOrderOperation()
  async cancelOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return this.ordersService.cancelOrder(orderId, currentUser);
  }

  @Get('')
  @GetOrdersOperation()
  async getOrders(@Query() query: GetOrdersQuery): Promise<GetOrdersResponse> {
    return await this.ordersService.getOrders(query);
  }

  @Get('user')
  @GetUserOrdersOperation()
  async getUserOrders(
    @Query() query: GetOrdersQuery,
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<GetOrdersResponse> {
    return this.ordersService.getUserOrders(query, currentUser);
  }

  @Patch(':orderId')
  @UpdateOrderOperation()
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<SuccessMessageType> {
    return await this.ordersService.updateOrder(orderId, dto);
  }
}
