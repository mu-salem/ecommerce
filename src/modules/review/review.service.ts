import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Types } from 'mongoose';
import { ReviewRepository } from 'src/DB/repositories/review.repository';
import { ProductRepository } from 'src/DB/repositories/Product.repository';
import { ProductService } from '../product/product.service';
import { console } from 'inspector';

@Injectable()
export class ReviewService {
  constructor(
    private readonly _ReviewRepository: ReviewRepository,
    private readonly _ProductRepository: ProductRepository,
    private readonly _ProductService: ProductService,
  ) {}
  async create(data: CreateReviewDto, userId: Types.ObjectId) {
    const { comment, rating, productId } = data;

    const product = await this._ProductService.checkProductExistence(productId);

    const reviewExists = await this._ReviewRepository.findOne({
      filter: { productId, createdBy: userId },
    });

    if (reviewExists) throw new BadRequestException('Review already exists!');

    const review = await this._ReviewRepository.create({
      comment,
      rating,
      productId,
      createdBy: userId,
    });

    return { data: review };
  }

  async update(
    reviewId: Types.ObjectId,
    userId: Types.ObjectId,
    data: UpdateReviewDto,
  ) {
    const reviewExists = await this._ReviewRepository.findOne({
      filter: { _id: reviewId, createdBy: userId },
    });

    if (!reviewExists) throw new BadRequestException('Review not found!');

    const review = await this._ReviewRepository.update({
      filter: { _id: reviewId, createdBy: userId },
      update: { ...data },
    });

    return { massage: 'Review updated successfully', data: { review } };
  }

  async remove(reviewId: Types.ObjectId, userId: Types.ObjectId) {
    const review = await this._ReviewRepository.delete({
      filter: { _id: reviewId, createdBy: userId },
    });

    if (!review) throw new BadRequestException('Review not found!');

    return { message: 'Review deleted successfully' };
  }
}
