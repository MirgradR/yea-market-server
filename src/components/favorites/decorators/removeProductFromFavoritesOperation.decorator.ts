import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function RemoveProductFromFavoritesOperation() {
    return applyDecorators(
        ApiOperation({ summary: 'Remove product from favorites' }),
        ApiOkResponse({  description: 'Product removed from favorites' }),
        ApiNotFoundResponse({  description: 'Favorite product not found' })
  );
}