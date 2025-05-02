import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class PaginateInput {
  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  page: number;
}
