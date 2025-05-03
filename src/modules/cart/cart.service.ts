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

    if (!this._ProductService.inStock(product, quantity)) {
      throw new BadRequestException(
        `Sorry only ${product.stock} pieces available in stock!`,
      );
    }

    const existingCart = await this._CartRepository.findOne({
      filter: { user: userId },
    });

    if (existingCart) {
      const existingProduct = existingCart.products.find(
        (p) => p.productId.toString() === productId.toString(),
      );

      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;

        if (!this._ProductService.inStock(product, newQuantity)) {
          throw new BadRequestException(
            `Sorry only ${product.stock} pieces available in stock!`,
          );
        }

        existingProduct.quantity = newQuantity;
        await existingCart.save();

        return { data: existingCart };
      } else {
        if (!this._ProductService.inStock(product, quantity)) {
          throw new BadRequestException(
            `Sorry only ${product.stock} pieces available in stock!`,
          );
        }

        existingCart.products.push({
          productId,
          quantity,
          price: product.price,
        });

        await existingCart.save();

        return { data: existingCart };
      }
    }

    const newCart = await this._CartRepository.create({
      user: userId,
      products: [{ productId, quantity, price: product.price }],
    });

    return { data: newCart };
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
