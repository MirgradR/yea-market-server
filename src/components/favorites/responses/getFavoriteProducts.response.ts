import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FavoritesType } from 'src/helpers/types/favorites.type';

export class GetFavoriteProductsResponse {
  @Type(() => FavoritesType)
  @ApiProperty({ type: [FavoritesType] })
  favoriteProducts: FavoritesType[];

  @ApiProperty({ description: 'Total count of favorite products' })
  totalCount: number;
}
