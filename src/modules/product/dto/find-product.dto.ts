import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

class PriceDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max?: number;
}

class SortDTO {
  @IsOptional()
  @IsString()
  by?: string;

  @IsOptional()
  @Type(() => Number)
  @IsIn([1, -1])
  dir?: -1 | 1;
}

export class FindProductDto {
  @IsOptional()
  @IsMongoId()
  category: Types.ObjectId;

  @IsOptional()
  @IsString()
  k?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDTO)
  price?: PriceDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortDTO)
  sort?: SortDTO;

  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive()
  @Type(() => Number)
  page: number;
}
