import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { Types } from 'mongoose';
import { User } from 'src/common/decorators/user.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() data: CreateCouponDto,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.couponService.create(data, userId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') reviewId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @Body() data: UpdateCouponDto,
  ) {
    return this.couponService.update(reviewId, userId, data);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) reviewId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.couponService.remove(reviewId, userId);
  }
}
