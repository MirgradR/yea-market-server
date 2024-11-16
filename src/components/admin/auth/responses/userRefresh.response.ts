import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';

export class AdminUserRefreshResponse extends PickType(SuccessResponse, [
  'message',
  'accessToken',
  'refreshToken',
] as const) {
  @ApiProperty({ type: AdminUsersResponse })
  @Type(() => AdminUsersResponse)
  user: AdminUsersResponse;
}
