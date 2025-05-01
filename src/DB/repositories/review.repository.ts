import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewDocument, ReviewModelName } from '../Models/review.model';

@Injectable()
export class ReviewRepository extends AbstractRepository<ReviewDocument> {
  constructor(
    @InjectModel(ReviewModelName) ReviewModel: Model<ReviewDocument>,
  ) {
    super(ReviewModel);
  }
}
