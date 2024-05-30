import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto';
import { UserEntity } from '../user.entity';

@Injectable()
export class UpdateUserCommand {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(updatedUser);

    return updatedUser;
  }
}
