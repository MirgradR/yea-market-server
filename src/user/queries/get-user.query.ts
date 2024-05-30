import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class GetUserQuery {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    return user;
  }
}
