import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/user.entity';
import { ClientTokenDto } from '../token/dto/token.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetUsersQuery } from './dto/getUsersQuery.dto';
import { DeleteUsersDto } from './dto/deleteUsers.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GetMeOperation } from './decorators/getMeOperation.decorator';
import { GetUsersOperation } from './decorators/getUsersOperation.decorator';
import { GetOneUserOperation } from './decorators/getOneUserOperation.decorator';
import { DeleteAccountOperation } from './decorators/deleteAccountOperation.decorator';
import { UpdateAccountOperation } from './decorators/updateAccountOperation.decorator';
import { DeleteUsersOperation } from './decorators/deleteUsersOperation.decorator';
import { UpdateUserOperation } from './decorators/updateUserOperation.decorator';
import { UsersType } from 'src/helpers/types/users.type';
import { GetUsersResponse } from './responses/getUsers.response';

@ApiTags('client-users')
@ApiBearerAuth()
@Controller('client/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @GetMeOperation()
  async getMe(@CurrentUser() currentUser: ClientTokenDto): Promise<UsersType> {
    return await this.usersService.getMe(currentUser);
  }

  @Get()
  @GetUsersOperation()
  async getUsers(@Query() query?: GetUsersQuery): Promise<GetUsersResponse> {
    return await this.usersService.getUsers(query);
  }

  @Get(':userId')
  @GetOneUserOperation()
  async getOneUser(@Param('userId') userId: string): Promise<UsersEntity> {
    return await this.usersService.getOneUser(userId);
  }

  @Delete('me')
  @DeleteAccountOperation()
  async deleteAccount(
    @CurrentUser() currentUser: ClientTokenDto,
  ): Promise<SuccessMessageType> {
    return await this.usersService.deleteAccount(currentUser);
  }

  @Patch('me')
  @UpdateAccountOperation()
  async updateAccount(
    @CurrentUser() currentUser: ClientTokenDto,
    @Body() dto: UpdateUserDto,
  ): Promise<UsersType> {
    return await this.usersService.updateAccount(currentUser, dto);
  }

  @Delete()
  @DeleteUsersOperation()
  async deleteUsers(@Body() dto: DeleteUsersDto): Promise<SuccessMessageType> {
    return await this.usersService.deleteUsers(dto);
  }

  @Patch(':userId')
  @UpdateUserOperation()
  async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UsersType> {
    return await this.usersService.updateUser(userId, dto);
  }
}
