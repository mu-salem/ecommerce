import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName })
  usedBy: Types.ObjectId[];

  @Prop({ type: Number, min: 1, max: 100, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModelName = Coupon.name;

export const CouponModel = MongooseModule.forFeature([
  { name: CouponModelName, schema: CouponSchema },
]);

export type CouponDocument = HydratedDocument<Coupon>;
