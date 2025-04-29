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
import { FileUploadService } from './../../common/services/fileupload/fileupload.service';
import { FileUploadModule } from 'src/common/services/fileupload/fileupload.module';

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
    min: 0,
    max: 100,
  })
  discount: number;

  @Prop({
    type: Number,
    default: function () {
      return this.price - (this.price * this.discount || 0) / 100;
    },
  })
  finalPrice: number;

  @Prop({ type: Number, min: 0, max: 5 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductModelName = Product.name;

// export const ProductModel = MongooseModule.forFeature([
//   { name: ProductModelName, schema: ProductSchema },
// ]);

export const ProductModel = MongooseModule.forFeatureAsync([
  {
    name: ProductModelName,
    useFactory: (fileUploadService: FileUploadService) => {
      ProductSchema.post(
        'deleteOne',
        { document: true, query: false },
        async function (doc, next) {
          await fileUploadService.deleteFolder(`${doc.cloudFolder}`);
        },
      );
      return ProductSchema;
    },
    inject: [FileUploadService],
    imports: [FileUploadModule],
  },
]);

export type ProductDocument = HydratedDocument<Product>;
