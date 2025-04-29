import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Role } from 'src/DB/enums/user.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Types } from 'mongoose';
import { User } from 'src/common/decorators/user.decorator';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(Role.USER)
  @Post()
  async addToCart(@Body() data: CartDto, @User('_id') userId: Types.ObjectId) {
    return this.cartService.addToCart(data, userId);
  }

  @Roles(Role.USER)
  @Patch()
  async updateCart(@Body() data: CartDto, @User('_id') userId: Types.ObjectId) {
    return this.cartService.updateCart(data, userId);
  }

  @Roles(Role.USER)
  @Patch('/clear')
  async clearCart(@User('_id') userId: Types.ObjectId) {
    return this.cartService.clearCart(userId);
  }
}
