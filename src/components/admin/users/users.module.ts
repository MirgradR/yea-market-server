import { Module } from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { AdminUsersController } from './users.controller';
import { AdminUserCommonModule } from '../userCommon/userCommon.module';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
  imports: [AdminUserCommonModule, MediaModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
})
export class AdminUsersModule {}
