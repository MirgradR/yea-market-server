import { IsUUID, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class DeleteUsersDto {
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsUUID('4', { each: true })
  userIds: string[];
}
