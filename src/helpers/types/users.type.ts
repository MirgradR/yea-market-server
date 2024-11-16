import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ClientTokensEntity } from 'src/components/client/token/entities/token.entity';
import { MediaType } from './mediaType';

export class UsersType {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  id: string;

  @ApiProperty({ example: 'John', description: 'Имя пользователя' })
  firstName: string;

  @ApiProperty({
    example: 'Acme Inc.',
    description: 'Название компании пользователя',
  })
  company: string;

  @ApiProperty({ example: 'US', description: 'Страна или регион пользователя' })
  countryRegion: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Адрес электронной почты пользователя',
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
  })
  phoneNumber: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Улица и номер дома пользователя',
  })
  streetAddress: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'Дата и время создания записи',
  })
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deleted: boolean;

  @Exclude()
  token?: ClientTokensEntity;


}
