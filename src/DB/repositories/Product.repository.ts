import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument, ProductModelName } from '../Models/product.model';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(ProductModelName) ProductModel: Model<ProductDocument>,
  ) {
    super(ProductModel);
  }
}
