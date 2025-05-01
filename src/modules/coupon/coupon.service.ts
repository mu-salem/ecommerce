import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Types } from 'mongoose';
import { CouponRepository } from 'src/DB/repositories/coupon.repository';

@Injectable()
export class CouponService {
  constructor(private readonly _CouponRepository: CouponRepository) {}

  async create(data: CreateCouponDto, userId: Types.ObjectId) {
    const { code, amount, fromDate, toDate } = data;
    const couponExist = await this._CouponRepository.findOne({
      filter: { code },
    });

    if (couponExist) throw new BadRequestException('Coupon already exist!');

    const coupon = await this._CouponRepository.create({
      code,
      amount,
      fromDate,
      toDate,
      createdBy: userId,
    });
    return { massage: 'Coupon created successfully', data: coupon };
  }

  async update(
    couponId: Types.ObjectId,
    userId: Types.ObjectId,
    data: UpdateCouponDto,
  ) {
    const couponExist = await this._CouponRepository.findOne({
      filter: { _id: couponId, createdBy: userId },
    });

    if (!couponExist)
      throw new BadRequestException('Coupon not found or User not authorized!');

    const coupon = await this._CouponRepository.update({
      filter: { _id: couponId, createdBy: userId },
      update: { ...data },
    });
    return { massage: 'Coupon updated successfully', data: { coupon } };
  }

  async remove(couponId: Types.ObjectId, userId: Types.ObjectId) {
    const couponExist = await this._CouponRepository.findOne({
      filter: { _id: couponId, createdBy: userId },
    });

    if (!couponExist)
      throw new BadRequestException('Coupon not found or User not authorized!');

    const coupon = await this._CouponRepository.delete({
      filter: { _id: couponId, createdBy: userId },
    });

    return { massage: 'Coupon deleted successfully', data: { coupon } };
  }
}
