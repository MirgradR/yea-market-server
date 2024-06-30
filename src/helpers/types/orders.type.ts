import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../constants/orderStatus.enum';
import { Exclude, Type } from 'class-transformer';
import { OrderProductsType } from './orderProduct.type';

export class OrderType {
  @ApiProperty({
    description: 'The unique identifier for the order.',
    example: '7a866dec-eb39-462a-bacd-55996d4023f3',
  })
  id: string;

  @ApiProperty({
    description: 'The address where the order should be delivered.',
    example: '123 Main St',
  })
  address: string;

  @ApiProperty({
    description: 'The city where the order should be delivered.',
    example: 'New York',
  })
  city: string;

  @ApiProperty({
    description: 'The company associated with the order, if applicable.',
    example: 'Acme Corp',
    required: false,
  })
  company?: string;

  @ApiProperty({
    description: 'The country where the order should be delivered.',
    example: 'USA',
  })
  country: string;

  @ApiProperty({
    description:
      'The email address of the person who placed the order, if applicable.',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The first name of the person who placed the order.',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the person who placed the order.',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Additional notes regarding the order, if applicable.',
    example: 'Leave at the front door',
    required: false,
  })
  note?: string;

  @ApiProperty({
    description: 'The phone number of the person who placed the order.',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The date and time when the order was created.',
    example: '2024-06-20T16:43:37.017Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The cost of shipping the order.',
    example: 10,
  })
  shippingCost: number;

  @ApiProperty({
    description: 'The state where the order should be delivered.',
    example: 'NY',
  })
  state: string;

  @ApiProperty({
    description: 'The current status of the order.',
    enum: OrderStatusEnum,
    example: OrderStatusEnum.toProcess,
    required: false,
  })
  status?: OrderStatusEnum;

  @ApiProperty({
    description: 'The subtotal amount of the order, excluding shipping.',
    example: 110,
    required: false,
  })
  subTotal?: number;

  @ApiProperty({
    description: 'The total price of the order, including shipping.',
    example: 120,
    required: false,
  })
  totalPrice?: number;

  @ApiProperty({
    description: 'The postal code where the order should be delivered.',
    example: '10001',
    required: false,
  })
  zipCode?: string;

  @Exclude()
  userId: string;

  @ApiProperty({
    description: 'The date and time when the order was delivered.',
    example: '2024-06-22T10:00:00.000Z',
  })
  deliveredAt: Date;

  @ApiProperty({
    description: 'The products included in the order.',
    type: [OrderProductsType],
  })
  @Type(() => OrderProductsType)
  orderProducts: OrderProductsType[];
}
