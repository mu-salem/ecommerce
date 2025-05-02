import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { PaginateResponse } from 'src/common/graphql/entities/paginate.entity';
import { OrderStatus, PaymentMethod } from 'src/DB/Models/order.model';
import { oneUserResponse } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class OneOrdersResponse {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => oneUserResponse)
  user: oneUserResponse;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  orderStatus: OrderStatus;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  paymentMethod: PaymentMethod;

  @Field(() => Boolean)
  paid: boolean;
}

@ObjectType()
export class AllOrdersResponse extends PaginateResponse {
  @Field(() => [OneOrdersResponse])
  data: OneOrdersResponse[];
}
