import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginateResponse {
  @Field(() => Int)
  totalSize: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  pageNumber: number;
}
