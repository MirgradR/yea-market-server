import { Injectable, Logger } from '@nestjs/common';
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
    });
    if (!user) {
      this.logger.warn(
        `Пользователь с адресом электронной почты ${email} не найден`,
      );
    }
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    this.logger.log(`Поиск пользователя по номеру телефона: ${phoneNumber}`);
    const user = await this.adminsRepository.findOne({
      where: { phoneNumber },
    });
    if (!user) {
      this.logger.warn(
        `Пользователь с номером телефона ${phoneNumber} не найден`,
      );
    }
    return user;
  }

  async findUserById(userId: string) {
    this.logger.log(`Поиск пользователя по ID: ${userId}`);
    const user = await this.adminsRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      this.logger.warn(`Пользователь с ID ${userId} не найден`);
    }
    return user;
  }
}
