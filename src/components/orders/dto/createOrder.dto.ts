import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsPostalCode,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Адрес доставки',
    example: '123 Main St',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Город доставки',
    example: 'New York',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Название компании',
    example: 'Acme Corp',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    description: 'Страна доставки',
    example: 'USA',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Email клиента',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Имя клиента',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Фамилия клиента',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Примечание к заказу',
    example: 'Leave at the front door',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Штат/регион доставки',
    example: 'NY',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Стоимость доставки',
    example: 10,
  })
  @IsNumber()
  shippingCost: number;

  @ApiProperty({
    description: 'Номер телефона клиента',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Почтовый индекс',
    example: '10001',
    required: false,
  })
  @IsOptional()
  zipCode?: string;
}
