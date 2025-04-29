import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from 'src/DB/repositories/cart.repository';
import { CartModel } from 'src/DB/Models/cart.model';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository],
  imports: [CartModel, ProductModule],
  exports: [CartRepository],
})
export class CartModule {}
