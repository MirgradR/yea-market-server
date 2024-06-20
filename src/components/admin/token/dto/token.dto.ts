import { AdminRole } from 'src/helpers/constants/adminRole.enum';
import { AdminsEntity } from '../../users/entities/admin.entity';

export class AdminTokenDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;

  constructor(entity: AdminsEntity) {
    this.id = entity.id;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.email = entity.email;
    this.role = entity.role;
  }
}
