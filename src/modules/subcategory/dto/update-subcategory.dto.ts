import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  category: Types.ObjectId;
}
