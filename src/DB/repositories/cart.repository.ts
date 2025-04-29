import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDocument, CartModelName } from '../Models/cart.model';

@Injectable()
export class CartRepository extends AbstractRepository<CartDocument> {
  constructor(@InjectModel(CartModelName) CartModel: Model<CartDocument>) {
    super(CartModel);
  }
}
