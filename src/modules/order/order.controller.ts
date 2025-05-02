import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/Models/user.model';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from 'src/DB/enums/user.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() data: CreateOrderDto, @User() user: UserDocument) {
    return this.orderService.create(data, user);
  }

  @Post('webhook')
  @Public()
  async stripeWebhook(@Body() data: any) {
    this.orderService.stripeWebhook(data);
    return;
  }

  @Roles(Role.USER)
  @Post('cancel/:id')
  async cancelOrder(
    @Param('id', ParseObjectIdPipe) orderId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.orderService.cancelOrder(orderId, userId);
  }
}
