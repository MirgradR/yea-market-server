import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { MediaService } from 'src/libs/media/media.service';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { AdminsEntity } from './entities/admin.entity';
import { generateHash } from 'src/helpers/providers/generateHash';
import { GetUsersQuery } from './dto/getUsers.query';
import { AdminRole } from 'src/helpers/constants/adminRole.enum';
import { UpdateUserResponse } from './responses/updateUser.response';
import { AdminTokenDto } from '../token/dto/token.dto';

@Injectable()
export class AdminUsersService {
  private logger = new Logger(AdminUsersService.name);

  constructor(
    @InjectRepository(AdminsEntity)
    private adminsRepository: Repository<AdminsEntity>,
    private mediaService: MediaService,
  ) {}

  async checkDefaultAdminUser() {
    const dto: CreateUserDto = {
      firstName: 'Test',
      lastName: 'Test',
      password: 'Test1234!',
      email: 'test@gmail.com',
      phoneNumber: '+79155590507',
      role: AdminRole.ADMINISTRATOR,
    };

    const user = await this.adminsRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      await this.createUser(dto);
      this.logger.log('Создан пользователь по умолчанию');
    } else {
      this.logger.log('Пользователь уже существует');
    }
  }

  async createUser(dto: CreateUserDto): Promise<AdminsEntity> {
    this.logger.log(`Попытка создания пользователя с email ${dto.email}`);

    const candidate = await this.adminsRepository.findOne({
      where: { email: dto.email },
    });

    if (candidate) {
      this.logger.error(`Пользователь с email ${dto.email} уже существует`);
      throw new ConflictException(
        `Пользователь с email ${dto.email} уже существует`,
      );
    }

    const hashedPassword = await generateHash(dto.password);

    const newUser = this.adminsRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hashedPassword,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role: dto.role,
    });

    const user = await this.adminsRepository.save(newUser);

    this.logger.log(`Пользователь ${user.email} успешно создан`);
    return user;
  }

  async getMe(currentUser: AdminTokenDto): Promise<AdminsEntity> {
    this.logger.log(`Запрос данных пользователя с id ${currentUser.id}`);

    const user = await this.adminsRepository.findOne({
      where: { id: currentUser.id },
    });

    if (!user) {
      this.logger.error(`Пользователь с id ${currentUser.id} не найден`);
      throw new NotFoundException('Пользователь не найден!');
    }

    this.logger.log(`Пользователь с id ${currentUser.id} найден`);
    return user;
  }

  async getUsers(
    query?: GetUsersQuery,
  ): Promise<{ users: AdminsEntity[]; totalCount: number }> {
    const { take = 10, page = 1 } = query;
    this.logger.log('Запрос списка пользователей');

    const [users, totalCount] = await this.adminsRepository.findAndCount({
      take: take,
      skip: (page - 1) * take,
    });

    this.logger.log('Список пользователей успешно получен');
    return { users, totalCount };
  }

  async uploadImage(
    currentUser: AdminTokenDto,
    image: ITransformedFile,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Попытка загрузки изображения для пользователя с id ${currentUser.id}`,
    );

    const user = await this.adminsRepository.findOne({
      where: { id: currentUser.id },
    });

    if (!user) {
      this.logger.error(`Пользователь с id ${currentUser.id} не найден`);
      throw new NotFoundException('Пользователь не найден!');
    }

    if (user.media) {
      await this.mediaService.deleteOneMedia(user.media.id);
      this.logger.log(
        `Старое изображение удалено для пользователя с id ${currentUser.id}`,
      );
    }

    await this.mediaService.createFileMedia(image, user.id, 'adminId');
    this.logger.log(
      `Новое изображение загружено для пользователя с id ${currentUser.id}`,
    );

    return { message: 'Изображение успешно загружено' };
  }

  async deleteImage(currentUser: AdminTokenDto): Promise<SuccessMessageType> {
    this.logger.log(
      `Попытка удаления изображения для пользователя с id ${currentUser.id}`,
    );

    const user = await this.adminsRepository.findOne({
      where: { id: currentUser.id },
      relations: { media: true },
    });
    console.log('🚀 ~ AdminUsersService ~ deleteImage ~ user:', user);

    if (!user || !user.media) {
      this.logger.error(
        'Изображение уже удалено или пользователя не существует',
      );
      throw new NotFoundException(
        'Изображение уже удалено или пользователя не существует',
      );
    }

    await this.mediaService.deleteOneMedia(user.media.id);
    this.logger.log(
      `Изображение удалено для пользователя с id ${currentUser.id}`,
    );

    return { message: 'Изображение успешно удалено' };
  }

  async updateUser(
    currentUser: AdminTokenDto,
    dto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    this.logger.log(
      `Попытка обновления данных пользователя с id ${currentUser.id}`,
    );

    const user = await this.adminsRepository.findOne({
      where: { id: currentUser.id },
    });

    if (!user) {
      this.logger.error(`Пользователь с id ${currentUser.id} не найден`);
      throw new NotFoundException('Пользователь не найден!');
    }

    if (dto.password) {
      dto.password = await generateHash(dto.password);
      this.logger.log('Пароль пользователя обновлен');
    }

    await this.adminsRepository.update(currentUser.id, { ...dto });
    this.logger.log(
      `Данные пользователя с id ${currentUser.id} успешно обновлены`,
    );

    return { user, message: 'Данные пользователя успешно обновлены' };
  }

  async deleteUser(
    userId: string,
    currentUser: AdminTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Попытка удаления пользователя с id ${userId}`);

    if (currentUser.id === userId) {
      this.logger.error('Пользователь не может удалить сам себя');
      throw new ConflictException('Пользователь не может удалить сам себя');
    }

    const user = await this.adminsRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`Пользователь с id ${userId} не найден`);
      throw new NotFoundException('Пользователь не найден!');
    }

    await this.adminsRepository.delete(userId);
    this.logger.log(`Пользователь с id ${userId} успешно удален`);

    return { message: 'Пользователь успешно удален' };
  }
}
