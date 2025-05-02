import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  subCategory: Types.ObjectId;
}
