import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/DB/repositories/order.repository';
import { UserDocument } from 'src/DB/Models/user.model';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { PaymentMethod } from 'src/DB/Models/order.model';
import { PaymentService } from 'src/common/services/payment/payment.service';

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

        await this._CartService.clearCart(userId);

        return { massage: 'done' };
      }
    }

    const session = await this.payWithCerd(order._id, products, user.email);

    await this._CartService.clearCart(userId);

    return { massage: 'done', data: session };
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

    await this._PaymentService.createCheckoutSession({
      customer_email: userEmail,
      metadata: { orderId },
      line_items,
      discounts: [{ coupon: id }],
    });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
