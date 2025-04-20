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

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'category_name_index' },
  })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  image: Image;

  @Prop({ type: String })
  cloudFolder: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function (next) {
  if (this.isModified('neme')) {
    this.slug = slugify(this.name, { lower: true });
  }
  return next();
});

export const CategoryModelName = Category.name;

export const CategoryModel = MongooseModule.forFeature([
  { name: CategoryModelName, schema: CategorySchema },
]);

export type CategoryDocument = HydratedDocument<Category>;
