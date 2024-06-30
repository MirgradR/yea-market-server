import { OmitType } from '@nestjs/swagger';
import { AdminUsersDto } from 'src/helpers/dto/admin/users.dto';

export class CreateAdminUserDto extends OmitType(AdminUsersDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
