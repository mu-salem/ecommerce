import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/DB/repositories/order.repository';
import { UserDocument } from 'src/DB/Models/user.model';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { OrderStatus, PaymentMethod } from 'src/DB/Models/order.model';
import { PaymentService } from 'src/common/services/payment/payment.service';
import { Types } from 'mongoose';
import { PaginateInput } from 'src/common/graphql/inputs/paginate.input';

@Injectable()
export class OrderService {
  constructor(
    private readonly _OrderRepository: OrderRepository,
    private readonly _CartService: CartService,
    private readonly _ProductService: ProductService,
    private readonly _PaymentService: PaymentService,
  ) {}

  async create(data: CreateOrderDto, user: UserDocument) {
    const userId = user._id;

    const cart = await this._CartService.getCart(userId);
    if (!cart || !cart.products.length)
      throw new BadRequestException('Empty Cart!');

    let price = 0;
    const products: any = [];
    for (const prd of cart.products) {
      const product = await this._ProductService.checkProductExistence(
        prd.productId,
      );
      if (this._ProductService.inStock(product, prd.quantity))
        throw new BadRequestException(
          `Sorry only ${product.stock} pieces available in stock!`,
        );

      price += product.finalPrice * prd.quantity;
      products.push({
        name: product.name,
        price: product.finalPrice,
        quantity: prd.quantity,
        image: product.thumbnail?.secure_url,
      });
    }

    const order = await this._OrderRepository.create({
      ...data,
      cart: cart._id,
      user: userId,
      price,
    });

    if (order.paymentMethod === PaymentMethod.cash) {
      const products = cart.products;
      for (const prd of products) {
        await this._ProductService.updateStock(
          prd.productId,
          prd.quantity,
          false,
        );
      }

      await this._CartService.clearCart(userId);

      return { message: 'done' };
    }

    const session = await this.payWithCerd(order._id, products, user.email);

    return { message: 'done', data: session.url };
  }

  async stripeWebhook(info: any) {
    const { orderId } = info.data.object.metadata;
    const order = await this._OrderRepository.update({
      filter: {
        _id: Types.ObjectId.createFromHexString(orderId),
        paid: false,
        paymentMethod: PaymentMethod.cart,
      },
      update: {
        paid: true,
        payment_intent: info.data.object.payment_intent,
      },
    });

    await this._CartService.clearCart(order!.user);
  }

  async cancelOrder(orderId: Types.ObjectId, userId: Types.ObjectId) {
    const order = await this._OrderRepository.findOne({
      filter: { _id: orderId, user: userId },
    });

    if (!order) throw new NotFoundException('Order not found!');

    const paymentintent = order.payment_intent;

    if (order.paymentMethod === PaymentMethod.cart) {
      await this._PaymentService.refund({ payment_intent: paymentintent });
      order.orderStatus = OrderStatus.refunded;
    }

    order.orderStatus = OrderStatus.canceled;
    await order.save();

    return { message: 'done' };
  }

  async payWithCerd(orderId, products, userEmail) {
    const line_items = products.map((product) => ({
      price_data: {
        currency: 'egp',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const { id } = await this._PaymentService.createCoupon({
      currency: 'egp',
      percent_off: 20,
    });

    return await this._PaymentService.createCheckoutSession({
      customer_email: userEmail,
      metadata: { orderId },
      line_items,
      discounts: [{ coupon: id }],
    });
  }

  async allOrders(userId: Types.ObjectId, paginate?: PaginateInput) {
    return this._OrderRepository.findAll({
      filter: { user: userId },
      populate: [{ path: 'user' }],
      paginate,
    });
  }
}
