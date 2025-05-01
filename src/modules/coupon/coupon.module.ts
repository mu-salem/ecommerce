import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepository } from 'src/DB/repositories/coupon.repository';
import { CouponModel } from 'src/DB/Models/coupon.model';

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
})
export class CouponModule {}
