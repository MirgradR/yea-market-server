import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';

export class UpdateAdminUserResponse extends PickType(SuccessResponse, ['message']) {
  @Type(() => AdminUsersResponse)
  @ApiProperty({ type: AdminUsersResponse })
  user: AdminUsersResponse;
}
