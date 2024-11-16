import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsEntity } from './entities/reviews.entity';
import { ProductCommonModule } from '../productCommon/productCommon.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewsEntity]), ProductCommonModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
