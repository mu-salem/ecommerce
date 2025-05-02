import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { AllOrdersResponse } from './entities/order.entity';
import { Graphql } from 'src/common/decorators/graphql.decorator';
import { SkipInterceptor } from 'src/common/decorators/skip-interceptor.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { Types } from 'mongoose';
import { User } from 'src/common/decorators/user-graphql.decorator';
import { PaginateInput } from 'src/common/graphql/inputs/paginate.input';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}

  @Graphql()
  @Roles(Role.USER)
  @SkipInterceptor()
  @Query(() => AllOrdersResponse)
  async allOrders(
    @User('_id') userId: Types.ObjectId,
    @Args('paginate', { nullable: true }) paginate?: PaginateInput,
  ) {
    return this._OrderService.allOrders(userId, paginate);
  }
}
