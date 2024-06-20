import { PartialType } from '@nestjs/swagger';
import { UsersDto } from 'src/helpers/dto/users.dto';

export class UpdateUserDto extends PartialType(UsersDto) {}
