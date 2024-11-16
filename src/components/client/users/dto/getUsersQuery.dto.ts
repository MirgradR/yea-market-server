import { PickType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetUsersQuery extends PickType(PageOptionsDto, [
  'q',
  'take',
  'page',
] as const) {}
