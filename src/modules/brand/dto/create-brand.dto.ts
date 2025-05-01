import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  subCategory: string;
}
