import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandDocument, BrandModelName } from '../Models/brand.model';

@Injectable()
export class BrandRepository extends AbstractRepository<BrandDocument> {
  constructor(@InjectModel(BrandModelName) BrandModel: Model<BrandDocument>) {
    super(BrandModel);
  }
}
