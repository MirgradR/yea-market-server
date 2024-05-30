import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsDate,
  IsUrl,
  Length,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 255)
  firstName?: string;

  @IsOptional()
  @Length(1, 255)
  lastName?: string;

  @IsOptional()
  @Length(1, 255)
  phone?: string;

  @IsOptional()
  @Length(1, 255)
  country?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  address?: string;

  @IsOptional()
  @Length(1, 255)
  city?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  birthday?: Date;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
