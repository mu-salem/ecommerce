import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SubCategoryDocument,
  SubCategoryModelName,
} from '../Models/subCategory.model';

@Injectable()
export class SubCategoryRepository extends AbstractRepository<SubCategoryDocument> {
  constructor(
    @InjectModel(SubCategoryModelName)
    SubCategoryModel: Model<SubCategoryDocument>,
  ) {
    super(SubCategoryModel);
  }
}
