import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';
import { ProductModelName } from './product.model';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ProductModelName })
  productId: Types.ObjectId;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewModelName = Review.name;

export const ReviewModel = MongooseModule.forFeature([
  { name: ReviewModelName, schema: ReviewSchema },
]);

export type ReviewDocument = HydratedDocument<Review>;
