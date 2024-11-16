import { PartialType } from '@nestjs/swagger';
import { CreateAdminUserDto } from './createUser.dto';

export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {}
