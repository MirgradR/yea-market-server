import { Module } from '@nestjs/common';
import { AdminTokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminTokensEntity } from './entities/tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminTokensEntity])],
  providers: [AdminTokenService],
  exports: [AdminTokenService],
})
export class AdminTokenModule {}
