import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument, OrderModelName } from '../Models/order.model';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  constructor(@InjectModel(OrderModelName) OrderModel: Model<OrderDocument>) {
    super(OrderModel);
  }
}
