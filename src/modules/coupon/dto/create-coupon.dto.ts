import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  amount: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(CheckCouponFromDate)
  fromDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(CheckCouponToDate)
  toDate: Date;
}
