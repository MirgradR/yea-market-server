import { Module } from '@nestjs/common';
import { AdminTokenService } from './token.service';

@Module({
  providers: [AdminTokenService],
  exports: [AdminTokenService],
})
export class AdminTokenModule {}
