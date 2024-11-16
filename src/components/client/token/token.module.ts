import { Module } from '@nestjs/common';
import { ClientTokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTokensEntity } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientTokensEntity])],
  providers: [ClientTokenService],
  exports: [ClientTokenService],
})
export class ClientTokenModule {}
