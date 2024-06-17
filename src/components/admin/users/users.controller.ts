import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { ITransformedFile } from 'src/helpers/interfaces/fileTransform.interface';
import { GetUsersQuery } from './dto/getUsers.query';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/isAdmin.decorator';
import { GetMeOperation } from './decorators/getMeOperation.decorator';
import { UpdateUserOperation } from './decorators/updateUserOperation.decorator';
import { DeleteUserOperation } from './decorators/deleteUserOperation.decorator';
import { UploadImageOperation } from './decorators/uploadImageOperation.decorator';
import { DeleteImageOperation } from './decorators/deleteImageOperation.decorator';
import { GetUsersOperation } from './decorators/getUsersOperation.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { GetUsersResponse } from './responses/getUsers.response';
import { AdminUsersResponse } from 'src/helpers/types/admin/user.type';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserOperation } from './decorators/createUserOperation.decorator';

@ApiBearerAuth()
@Admin()
@Controller('admin/users')
@ApiTags('admin-users')
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Post()
  @CreateUserOperation()
  async createUser(@Body() dto: CreateUserDto): Promise<AdminUsersResponse> {
    return await this.usersService.createUser(dto);
  }

  @Get('me')
  @GetMeOperation()
  async getMe(
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<AdminUsersResponse> {
    return await this.usersService.getMe(currentUser);
  }
  @Get('')
  @GetUsersOperation()
  async getUsers(@Query() query: GetUsersQuery): Promise<GetUsersResponse> {
    return await this.usersService.getUsers(query);
  }

  @Patch('')
  @UpdateUserOperation()
  async updateUser(
    @CurrentUser() currentUser: UserTokenDto,
    @Body() dto: UpdateUserDto,
  ): Promise<SuccessMessageType> {
    return await this.usersService.updateUser(currentUser, dto);
  }

  @Delete(':userId')
  @DeleteUserOperation()
  async deleteUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    return await this.usersService.deleteUser(userId, currentUser);
  }

  @Post('image')
  @UploadImageOperation()
  async uploadImage(
    @UploadedFile(ImageTransformer) image: ITransformedFile,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    return await this.usersService.uploadImage(currentUser, image);
  }

  @Delete('image')
  @DeleteImageOperation()
  async deleteImage(
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    return await this.usersService.deleteImage(currentUser);
  }
}
