import { AdminRole } from '@prisma/client';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { generateHash } from 'src/helpers/providers/generateHash';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserCommonService } from '../userCommon/userCommon.service';
import { GetUsersQuery } from './dto/getUsers.query';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { MediaService } from 'src/libs/media/media.service';
import { GetUsersResponse } from './responses/getUsers.response';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

@Injectable()
export class AdminUsersService {
  private logger = new Logger(AdminUsersService.name);

  constructor(
    private prismaService: PrismaService,
    private userCommonService: UserCommonService,
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

    const user = await this.prismaService.admins.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      await this.createUser(dto);
      this.logger.log('Создан пользователь по умолчанию');
    } else {
      this.logger.log('Пользователь уже существует');
    }
  }

  async createUser(dto: CreateUserDto): Promise<AdminUsersResponse> {
    this.logger.log(`Попытка создания пользователя с email ${dto.email}`);

    const candidate = await this.prismaService.admins.findUnique({
      where: { email: dto.email },
    });

    if (candidate) {
      this.logger.error(`Пользователь с email ${dto.email} уже существует`);
      throw new ConflictException(
        `Пользователь с email ${dto.email} уже существует`,
      );
    }

    const user = await this.prismaService.admins.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: (await generateHash(dto.password)) || undefined,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
      },
    });

    this.logger.log(`Пользователь ${user.email} успешно создан`);
    return user;
  }

  async getMe(currentUser: UserTokenDto): Promise<AdminUsersResponse> {
    this.logger.log(`Запрос данных пользователя с id ${currentUser.id}`);

    const user = await this.prismaService.admins.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      this.logger.error(`Пользователь с id ${currentUser.id} не найден`);
      throw new NotFoundException('Пользователь не найден!');
    }

    this.logger.log(`Пользователь с id ${currentUser.id} найден`);
    return user;
  }

  async getUsers(query?: GetUsersQuery): Promise<GetUsersResponse> {
    this.logger.log('Запрос списка пользователей');

    const { page = 1, take = 10 } = query;

    const users = await this.prismaService.admins.findMany({
      take: take,
      skip: (page - 1) * take,
    });

    const totalCount = await this.prismaService.admins.count();

    this.logger.log('Список пользователей успешно получен');
    return { users, totalCount };
  }

  async uploadImage(
    currentUser: UserTokenDto,
    image: ITransformedFile,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Попытка загрузки изображения для пользователя с id ${currentUser.id}`,
    );

    const user = await this.userCommonService.findUserById(currentUser.id);

    const media = await this.prismaService.media.findUnique({
      where: { adminId: currentUser.id },
    });

    if (media) {
      await this.mediaService.deleteOneMedia(media.id);
      this.logger.log(
        `Старое изображение удалено для пользователя с id ${currentUser.id}`,
      );
      await this.mediaService.createFileMedia(image, user.id, 'adminId');
      this.logger.log(
        `Новое изображение загружено для пользователя с id ${currentUser.id}`,
      );
      return { message: 'Изображение успешно загружено' };
    }

    await this.mediaService.createFileMedia(image, user.id, 'adminId');
    this.logger.log(
      `Изображение загружено для пользователя с id ${currentUser.id}`,
    );
    return { message: 'Изображение успешно загружено' };
  }

  async deleteImage(currentUser: UserTokenDto): Promise<SuccessMessageType> {
    this.logger.log(
      `Попытка удаления изображения для пользователя с id ${currentUser.id}`,
    );

    const user = await this.prismaService.admins.findUnique({
      where: { id: currentUser.id },
      include: { media: true },
    });

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

  async updateUser(currentUser: UserTokenDto, dto: UpdateUserDto) {
    this.logger.log(
      `Попытка обновления данных пользователя с id ${currentUser.id}`,
    );

    const user = await this.userCommonService.findUserById(currentUser.id);

    if (dto.password) {
      dto.password = await generateHash(dto.password);
      this.logger.log('Пароль пользователя обновлен');
    }

    await this.prismaService.admins.update({
      where: { id: user.id },
      data: { ...dto },
    });

    this.logger.log(
      `Данные пользователя с id ${currentUser.id} успешно обновлены`,
    );
    return { message: 'Данные пользователя успешно обновлены' };
  }

  async deleteUser(
    userId: string,
    currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Попытка удаления пользователя с id ${userId}`);

    if (currentUser.id === userId) {
      this.logger.error('Пользователь не может удалить сам себя');
      throw new ConflictException('Пользователь не может удалить сам себя');
    }

    const user = await this.userCommonService.findUserById(userId);

    await this.prismaService.admins.delete({ where: { id: user.id } });
    this.logger.log(`Пользователь с id ${userId} успешно удален`);

    return { message: 'Пользователь успешно удален' };
  }
}
