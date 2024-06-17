import { PickType } from '@nestjs/swagger';
import { AdminUsersDto } from 'src/helpers/dto/admin/users.dto';

export class UserLoginDto extends PickType(AdminUsersDto, [
  'email',
  'password',
]) {}
