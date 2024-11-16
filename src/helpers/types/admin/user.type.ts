import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AdminsEntity } from 'src/components/admin/users/entities/admin.entity';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';

export class AdminUsersType extends AdminsEntity {
  @ApiProperty({ description: 'Unique identifier of the admin user' })
  id: string;

  @ApiProperty({ description: 'First name of the admin user' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the admin user' })
  lastName: string;

  @ApiProperty({ description: 'Email address of the admin user' })
  email: string;

  @ApiProperty({ description: 'Date when the admin user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the admin user was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Password of the admin user' })
  password: string;

  @ApiProperty({ description: 'Phone number of the admin user' })
  phoneNumber: string;

  @ApiProperty({ description: 'Role of the admin user', enum: AdminRole })
  role: AdminRole;
}

export class AdminUsersResponse extends AdminsEntity {
  @ApiProperty({ description: 'Unique identifier of the admin user' })
  id: string;

  @ApiProperty({ description: 'First name of the admin user' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the admin user' })
  lastName: string;

  @ApiProperty({ description: 'Email address of the admin user' })
  email: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  phoneNumber: string;

  @ApiProperty({ description: 'Role of the admin user', enum: AdminRole })
  role: AdminRole;
}
