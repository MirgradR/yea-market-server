import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';

export class GetAdminUsersResponse {
  @Type(() => AdminUsersResponse)
  @ApiProperty({ type: [AdminUsersResponse] })
  users: AdminUsersResponse[];

  @ApiProperty({ description: 'Total count of users' })
  totalCount: number;
}
