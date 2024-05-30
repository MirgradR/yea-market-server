import { Injectable } from '@nestjs/common';
import { UpdateUserCommand } from './commands';
import { GetUserQuery, GetUsersQuery } from './queries';
import { UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { hashPassword } from 'src/auth/utils/hash-password';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private getUsersQuery: GetUsersQuery,
    private getUserQuery: GetUserQuery,
    private updateUserCommand: UpdateUserCommand,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.getUsersQuery.execute();
  }

  findByFirebaseUuid(id: string): Promise<UserEntity> {
    return this.getUserQuery.execute(id);
  }

  update(id: string, userDto: UpdateUserDto): Promise<UserEntity> {
    return this.updateUserCommand.execute(id, userDto);
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await hashPassword(newPassword);

    await this.usersRepository.update(userId, {
      passwordHash: passwordHash,
    });
  }
}
