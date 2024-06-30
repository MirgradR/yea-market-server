import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersCommonService {
  private readonly logger = new Logger(UsersCommonService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  async findUserByEmail(email: string) {
    this.logger.log(`Поиск пользователя по адресу электронной почты: ${email}`);
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      this.logger.warn(
        `Пользователь с адресом электронной почты ${email} не найден`,
      );
      throw new NotFoundException('User with this email not found!');
    }
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    this.logger.log(`Поиск пользователя по номеру телефона: ${phoneNumber}`);
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    if (!user) {
      this.logger.warn(
        `Пользователь с номером телефона ${phoneNumber} не найден`,
      );
      throw new NotFoundException('User with this phone number not found!');
    }
    return user;
  }

  async findUserById(userId: string) {
    this.logger.log(`Поиск пользователя по ID: ${userId}`);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      this.logger.warn(`Пользователь с ID ${userId} не найден`);
      throw new NotFoundException('User with this id not found!');
    }
    return user;
  }
}
