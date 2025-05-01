import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  comment: string;

  @Type(() => Types.ObjectId)
  @IsMongoId()
  productId: Types.ObjectId;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
