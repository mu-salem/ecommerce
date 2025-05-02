import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from 'src/DB/repositories/order.repository';
import { OrderModel } from 'src/DB/Models/order.model';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from 'src/common/services/payment/payment.module';
import { OrderResolver } from './order.resolver';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderResolver],
  imports: [OrderModel, ProductModule, CartModule, PaymentModule],
})
export class OrderModule {}
