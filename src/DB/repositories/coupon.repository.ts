import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CouponDocument, CouponModelName } from '../Models/coupon.model';

@Injectable()
export class CouponRepository extends AbstractRepository<CouponDocument> {
  constructor(
    @InjectModel(CouponModelName) CouponModel: Model<CouponDocument>,
  ) {
    super(CouponModel);
  }
}
