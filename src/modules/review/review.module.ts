import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from 'src/DB/repositories/review.repository';
import { ProductRepository } from 'src/DB/repositories/Product.repository';
import { ReviewModel } from 'src/DB/Models/review.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, ProductRepository],
  imports: [ReviewModel, ProductModel, ProductModule],
})
export class ReviewModule {}
