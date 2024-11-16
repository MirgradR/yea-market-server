import {
  HttpException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ClientTokenDto } from '../client/token/dto/token.dto';
import { CreateOrderDto } from './dto/createOrder.dto';
import { BasketEntity } from '../basket/entities/basket.entity';
import { OrderProductsEntity } from './entities/orderProducts.entity';
import { BasketProductsEntity } from '../basket/entities/basketProducts.entity';
import { OrderStatusEnum } from 'src/helpers/constants/orderStatus.enum';
import { GetOrdersQuery } from './dto/getOrders.query';
import { OrderType } from 'src/helpers/constants';
import { OrderSortEnum } from 'src/helpers/constants/orderSort.enum';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { GetOrdersResponse } from './responses/getOrders.response';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductsEntity)
    private dataSource: DataSource,
  ) {}

  async createOrder(
    dto: CreateOrderDto,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(OrderEntity, {
        ...dto,
        userId: currentUser.id,
        status: OrderStatusEnum.toProcess,
        totalPrice: dto.shippingCost,
      });

      await queryRunner.manager.save(order);
      await this.orderProductsFromBasket(order, currentUser, queryRunner);

      this.logger.log('Заказ успешно создан');
      return { message: 'Заказ успешно создан!' };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.status);
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(
    orderId: string,
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    const order = await this.findOrderById(orderId, currentUser.id);
    order.status = OrderStatusEnum.canceled;
    await this.orderRepository.save(order);
    this.logger.log('Заказ успешно отменен');
    return { message: 'Заказ успешно отменен!' };
  }

  async getOrders(query?: GetOrdersQuery): Promise<GetOrdersResponse> {
    const {
      page = 1,
      take = 10,
      q = '',
      order = OrderType.ASC,
      orderBy = OrderSortEnum.createdAt,
      status,
    } = query;

    const orderQuery = this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('product.colors', 'colors')
      .leftJoinAndSelect('product.medias', 'medias');

    if (q) {
      orderQuery.where('product.title ILIKE :q', { q: `%${q}%` });
    }

    if (status) {
      orderQuery.andWhere('orders.status = :status', { status });
    }

    let orderByColumn;
    if (orderBy === OrderSortEnum.price) {
      orderByColumn = `product.${orderBy}`;
    } else if (orderBy === OrderSortEnum.createdAt) {
      orderByColumn = `orders.${orderBy}`;
    } else if (orderBy === OrderSortEnum.deliveredAt) {
      orderByColumn = `orders.${orderBy}`;
    } else if (orderBy === OrderSortEnum.title) {
      orderByColumn = `product.${orderBy}`;
    } else {
      orderByColumn = `orders.${orderBy}`;
    }

    const [orders, totalCount] = await orderQuery
      .take(take)
      .skip((page - 1) * take)
      .orderBy(orderByColumn, order)
      .getManyAndCount();

    this.logger.log(`Найдено заказов: ${orders.length}`);
    return { totalCount, orders };
  }

  async getUserOrders(
    query: GetOrdersQuery,
    currentUser: ClientTokenDto,
  ): Promise<GetOrdersResponse> {
    const {
      page = 1,
      take = 10,
      q = '',
      order = OrderType.ASC,
      orderBy = OrderSortEnum.createdAt,
      status,
    } = query;

    const orderQuery = this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('product.colors', 'colors')
      .leftJoinAndSelect('product.medias', 'medias')
      .where('orders.userId = :userId', { userId: currentUser.id });

    if (q) {
      orderQuery.andWhere('product.title ILIKE :q', { q: `%${q}%` });
    }

    if (status) {
      orderQuery.andWhere('orders.status = :status', { status });
    }

    let orderByColumn;
    if (orderBy === OrderSortEnum.price) {
      orderByColumn = `product.${orderBy}`;
    } else if (orderBy === OrderSortEnum.createdAt) {
      orderByColumn = `orders.${orderBy}`;
    } else if (orderBy === OrderSortEnum.deliveredAt) {
      orderByColumn = `orders.${orderBy}`;
    } else if (orderBy === OrderSortEnum.title) {
      orderByColumn = `product.${orderBy}`;
    } else {
      orderByColumn = `orders.${orderBy}`;
    }

    const [orders, totalCount] = await orderQuery
      .take(take)
      .skip((page - 1) * take)
      .orderBy(orderByColumn, order)
      .getManyAndCount();

    this.logger.log(`Найдено заказов пользователя: ${orders.length}`);
    return { totalCount, orders };
  }

  async updateOrder(
    orderId: string,
    dto: UpdateOrderDto,
  ): Promise<SuccessMessageType> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    if (dto.status === OrderStatusEnum.delivered) {
      order.status = dto.status;
      order.deliveredAt = new Date(Date.now());
      await this.orderRepository.save(order);
      this.logger.log('Заказ успешно обновлен и доставлен');
      return { message: 'Заказ успешно обновлен и доставлен' };
    }

    order.status = dto.status;
    await this.orderRepository.save(order);
    this.logger.log('Статус заказа успешно обновлен');
    return { message: 'Статус заказа успешно обновлен' };
  }

  private async findOrderById(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    return order;
  }

  private async orderProductsFromBasket(
    order: OrderEntity,
    currentUser: ClientTokenDto,
    queryRunner: QueryRunner,
  ) {
    const userBasket = await queryRunner.manager.findOne(BasketEntity, {
      where: { userId: currentUser.id },
    });

    const basketProducts = await queryRunner.manager.find(
      BasketProductsEntity,
      {
        where: { basketId: userBasket.id },
      },
    );

    if (basketProducts.length <= 0) {
      throw new NotFoundException('Your basket is empty');
    }

    for (const product of basketProducts) {
      const orderProduct = queryRunner.manager.create(OrderProductsEntity, {
        quantity: product.quantity,
        totalPrice: product.totalPrice,
        productId: product.productId,
        orderId: order.id,
      });

      order.subTotal += product.totalPrice;
      order.totalPrice += product.totalPrice;

      await queryRunner.manager.save(orderProduct);
      await queryRunner.manager.save(order);
    }

    await queryRunner.manager.delete(BasketProductsEntity, {
      basketId: userBasket.id,
    });
  }
}
