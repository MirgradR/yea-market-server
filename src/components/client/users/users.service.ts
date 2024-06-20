import { Injectable, NotFoundException,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './entities/user.entity';
import { ClientTokenDto } from '../token/dto/token.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetUsersQuery } from './dto/getUsersQuery.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { generateHash } from 'src/helpers/providers/generateHash';
import { DeleteUsersDto } from './dto/deleteUsers.dto';
import { GetUsersResponse } from './responses/getUsers.response';
import { UsersType } from 'src/helpers/types/users.type';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async getMe(currentUser: ClientTokenDto): Promise<UsersType> {
    const user = await this.usersRepository.findOne({
      where: { id: currentUser.id },
    });
    if (!user) {
      this.logger.error('Пользователь не найден');
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async getUsers(query?: GetUsersQuery): Promise<GetUsersResponse> {
    const { q = '', take = 10, page = 1 } = query || {};

    let queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (q) {
      queryBuilder = queryBuilder
        .where('user.firstName LIKE :name', { name: `%${q}%` })
        .orWhere('user.email LIKE :email', { email: `%${q}%` });
    }

    const [users, totalCount] = await queryBuilder
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    this.logger.log(`Найдено пользователей: ${users.length}`);
    return { users, totalCount };
  }

  async getOneUser(userId: string): Promise<UsersEntity> {
    const user = await this.findUserById(userId);
    if (!user) {
      this.logger.error(`Пользователь с ID ${userId} не найден`);
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    return user;
  }

  async deleteAccount(
    currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    const user = await this.findUserById(currentUser.id);
    if (!user) {
      this.logger.error('Пользователь не найден');
      throw new NotFoundException('Пользователь не найден');
    }
    await this.usersRepository.delete(currentUser.id);
    this.logger.log('Учетная запись пользователя успешно удалена');
    return { message: 'Учетная запись успешно удалена!' };
  }

  async updateAccount(
    currentUser: ClientTokenDto,
    dto: UpdateUserDto,
  ): Promise<UsersType> {
    const user = await this.findUserById(currentUser.id);
    if (!user) {
      this.logger.error('Пользователь не найден');
      throw new NotFoundException('Пользователь не найден');
    }
    if (dto.password) {
      dto.password = await generateHash(dto.password);
    }
    await this.usersRepository.update(currentUser.id, dto);
    const updatedUser = await this.findUserById(currentUser.id);
    this.logger.log(
      `Учетная запись пользователя с ID ${currentUser.id} успешно обновлена`,
    );
    return updatedUser;
  }

  async deleteUsers(dto: DeleteUsersDto): Promise<SuccessMessageType> {
    await this.usersRepository.delete(dto.userIds);
    this.logger.log(
      `Пользователи с ID ${dto.userIds.join(', ')} успешно удалены`,
    );
    return { message: 'Users deleted successfully!' };
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UsersType> {
    const user = await this.findUserById(userId);
    if (!user) {
      this.logger.error(`Пользователь с ID ${userId} не найден`);
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    if (dto.password) {
      dto.password = await generateHash(dto.password);
    }
    await this.usersRepository.update(userId, dto);
    const updatedUser = await this.findUserById(userId);
    this.logger.log(`Пользователь с ID ${userId} успешно обновлен`);
    return updatedUser;
  }

  private async findUserById(userId: string): Promise<UsersEntity | undefined> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
}
