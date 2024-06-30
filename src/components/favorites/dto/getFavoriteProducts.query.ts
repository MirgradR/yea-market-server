import { PickType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetFavoriteProductsQuery extends PickType(PageOptionsDto, [
  'take',
  'page',
]) {}
