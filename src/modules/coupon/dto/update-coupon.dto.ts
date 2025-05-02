import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateCouponDto } from './create-coupon.dto';

@ValidatorConstraint({ async: true })
export class CheckCouponToDate implements ValidatorConstraintInterface {
  validate(
    toDate: any,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (!args?.object || !args.object['fromDate']) return false;
    return toDate >= args.object['fromDate'];
  }
  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} must be after ${args?.object['fromDate']}`;
  }
}

@ValidatorConstraint({ async: true })
export class CheckCouponFromDate implements ValidatorConstraintInterface {
  validate(
    fromDate: any,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return fromDate >= new Date();
  }
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @IsString()
  @IsOptional()
  code: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  amount: number;

  @IsDate()
  @Type(() => Date)
  @Validate(CheckCouponFromDate)
  @IsOptional()
  fromDate: Date;

  @IsDate()
  @Type(() => Date)
  @Validate(CheckCouponToDate)
  @IsOptional()
  toDate: Date;
}
