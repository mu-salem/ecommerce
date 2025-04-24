import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';
import { Image } from 'src/common/types/image.type';
import slugify from 'slugify';
import { CategoryModelName } from './category.model';

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'Product_name_index' },
    set: function (value: string) {
      this.slug = slugify(value, { lower: true });
      return value;
    },
  })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  thumbnail: Image;

  @Prop({ type: [{ secure_url: String, public_id: String }] })
  images: Image[];

  @Prop({ type: String })
  cloudFolder: string;

  @Prop({ type: Types.ObjectId, ref: CategoryModelName, required: true })
  category: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  stock: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    set: function (value: number) {
      this.finalPrice = this.price - (this.price * value) / 100;
      return value;
    },
  })
  discount: number;

  @Prop({
    type: Number,
    required: true,
    default: function () {
      return this.price;
    },
  })
  finalPrice: number;

  @Prop({ type: Number, min: 0, max: 5 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductModelName = Product.name;

export const ProductModel = MongooseModule.forFeature([
  { name: ProductModelName, schema: ProductSchema },
]);

export type ProductDocument = HydratedDocument<Product>;
