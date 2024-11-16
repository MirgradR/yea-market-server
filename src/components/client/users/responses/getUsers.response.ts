import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UsersType } from 'src/helpers/types/users.type';

export class GetUsersResponse {
  @Type(() => UsersType)
  @ApiProperty({ type: [UsersType] })
  users: UsersType[];

  @ApiProperty({ description: 'Clients count', example: 1234 })
  totalCount: number;
}
