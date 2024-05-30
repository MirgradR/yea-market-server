import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class GetUserByIdQuery {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(id: UserEntity['id']): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }
}
