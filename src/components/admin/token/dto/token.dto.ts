import { AdminRole, Admins } from '@prisma/client';

export class UserTokenDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;

  constructor(entity: Admins) {
    this.id = entity.id;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.email = entity.email;
    this.role = entity.role;
  }
}
