import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntityPublic } from '../types';
import { RegistrationUserDto } from 'src/auth/dto/registration-user.dto';
import { hashPassword } from 'src/auth/utils';
import { UserEntity } from '../user.entity';

@Injectable()
export class CreateUserCommand {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async execute(createUserDto: RegistrationUserDto): Promise<UserEntityPublic> {
    const passwordHash = await hashPassword(createUserDto.password);

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
    });

    await this.usersRepository.save(user);

    return user;
  }
}
