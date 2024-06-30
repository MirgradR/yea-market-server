import { Min } from 'class-validator';

export class UpdateBasketProductCountDto {
  @Min(-1)
  count: number;
}
