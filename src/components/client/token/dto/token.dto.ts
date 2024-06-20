import { UsersEntity } from '../../users/entities/user.entity';

export class ClientTokenDto {
  id: string;
  firstName: string;
  email: string;

  constructor(entity: UsersEntity) {
    this.id = entity.id;
    this.firstName = entity.firstName;
    this.email = entity.email;
  }
}
