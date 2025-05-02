import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class oneUserResponse {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
