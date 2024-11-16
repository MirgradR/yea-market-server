import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminsEntity } from '../users/entities/admin.entity';

@Injectable()
export class UserCommonService {
  private readonly logger = new Logger(UserCommonService.name);

  constructor(
    @InjectRepository(AdminsEntity)
    private adminsRepository: Repository<AdminsEntity>,
  ) {}

  async findUserByEmail(email: string) {
    this.logger.log(`Поиск пользователя по адресу электронной почты: ${email}`);
    const user = await this.adminsRepository.findOne({
      where: { email },
      relations: { media: true },
    });
    if (!user) {
      this.logger.warn(
        `Пользователь с адресом электронной почты ${email} не найден`,
      );
      throw new NotFoundException('User by email not found!');
    }
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    this.logger.log(`Поиск пользователя по номеру телефона: ${phoneNumber}`);
    const user = await this.adminsRepository.findOne({
      where: { phoneNumber },
      relations: { media: true },
    });
    if (!user) {
      this.logger.warn(
        `Пользователь с номером телефона ${phoneNumber} не найден`,
      );
      throw new NotFoundException('User by phone number not found!');
    }
    return user;
  }

  async findUserById(userId: string) {
    this.logger.log(`Поиск пользователя по ID: ${userId}`);
    const user = await this.adminsRepository.findOne({
      where: { id: userId },
      relations: { media: true },
    });
    if (!user) {
      this.logger.warn(`Пользователь с ID ${userId} не найден`);
      throw new NotFoundException('User by id not found!');
    }
    return user;
  }
}
