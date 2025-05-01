import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartDto } from './dto/cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository } from 'src/DB/repositories/cart.repository';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/DB/repositories/Product.repository';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    private readonly _CartRepository: CartRepository,
    private readonly _ProductRepository: ProductRepository,
    private readonly _ProductService: ProductService,
  ) {}

  async addToCart(data: CartDto, userId: Types.ObjectId) {
    const { productId, quantity } = data;

    const product = await this._ProductService.checkProductExistence(productId);

    if (!this._ProductService.inStock(product, quantity))
      throw new BadRequestException(
        `Sorry only ${product.stock} pieces available in stock!`,
      );

    const isProductInCart = await this._CartRepository.findOne({
      filter: { 'products.productId': productId, user: userId },
    });

    if (isProductInCart) {
      const theProduct = isProductInCart.products.find(
        (p) => p.productId.toString() === productId.toString(),
      );

      if (
        this._ProductService.inStock(product, theProduct!.quantity + quantity)
      ) {
        theProduct!.quantity += quantity;
        await isProductInCart.save();

        return { data: isProductInCart };
      }
    } else {
      throw new BadRequestException(
        `Sorry only ${product.stock} pieces available in stock!`,
      );
    }

    const cart = await this._CartRepository.update({
      filter: { user: userId },
      update: {
        $push: { products: { productId, quantity, price: product.price } },
      },
    });

    return { data: cart };
  }

  async updateCart(data: CartDto, userId: Types.ObjectId) {
    const { productId, quantity } = data;

    const product = await this._ProductRepository.findOne({
      filter: { _id: productId },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);

    if (!this._ProductService.inStock(product, quantity))
      throw new BadRequestException(
        `Sorry only ${product.stock} pieces available in stock!`,
      );

    const cart = await this._CartRepository.update({
      filter: { user: userId, 'products.productId': productId },
      update: {
        'products.$.quantity': quantity,
        'products.$.price': product.finalPrice,
      },
    });

    return { data: cart };
  }

  async clearCart(userId: Types.ObjectId) {
    const cart = await this._CartRepository.update({
      filter: { user: userId },
      update: { products: [] },
    });

    return { data: cart };
  }

  async getCart(userId: Types.ObjectId) {
    return this._CartRepository.findOne({ filter: { user: userId } });
  }
}
