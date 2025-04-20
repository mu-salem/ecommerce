import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument, CategoryModelName } from '../Models/category.model';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
  constructor(
    @InjectModel(CategoryModelName) CategoryModel: Model<CategoryDocument>,
  ) {
    super(CategoryModel);
  }
}
