import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'argon2';
import { UserEntity } from '../user.entity';

@Injectable()
export class UpdateRefreshTokenCommand {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async execute(
    userId: UserEntity['id'],
    refreshToken: UserEntity['refreshToken'],
  ) {
    let tokenHashed = refreshToken;

    if (refreshToken) {
      tokenHashed = await hash(refreshToken);
    }

    await this.usersRepository.update(
      { id: userId },
      { refreshToken: tokenHashed },
    );

    const updatedUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'clientRole',
        'clientRole.clientCompanies',
        'clientRole.clientCompanies.company',
        'adminRoles',
        'adminRoles.company',
        'company',
      ],
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }
}
