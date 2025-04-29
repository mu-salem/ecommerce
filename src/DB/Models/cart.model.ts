import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';
import { ProductModelName } from './product.model';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: {
          type: Types.ObjectId,
          ref: ProductModelName,
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
  })
  products: { productId: Types.ObjectId; quantity: number; price: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

export const CartModelName = Cart.name;
export const CartModel = MongooseModule.forFeature([
  { name: CartModelName, schema: CartSchema },
]);
export type CartDocument = HydratedDocument<Cart>;
