import { ApiProperty } from '@nestjs/swagger';
import { AdminRole, Admins } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class AdminUsersDto implements Admins {
  @ApiProperty({ example: '1', description: 'Unique identifier for the admin' })
  id: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email of the admin',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the admin' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the admin' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'password123', description: 'Password of the admin' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: '+123456789',
    description: 'Phone number of the admin',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'ADMIN', description: 'Role of the admin' })
  @IsEnum(AdminRole)
  @IsNotEmpty()
  role: AdminRole;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
