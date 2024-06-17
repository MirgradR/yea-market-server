import { Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';

export class UserLoginResponse extends PickType(SuccessResponse, [
  'message',
  'accessToken',
  'refreshToken',
] as const) {
  @ApiProperty({ type: AdminUsersResponse })
  @Type(() => AdminUsersResponse)
  user: AdminUsersResponse;
}
