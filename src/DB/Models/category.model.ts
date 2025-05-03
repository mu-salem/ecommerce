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
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import { FileUploadModule } from 'src/common/services/fileupload/fileupload.module';

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'category_name_index' },
  })
  name: string;

  @Prop({ type: String, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  image: Image;

  @Prop({ type: String })
  cloudFolder: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export const CategoryModelName = Category.name;

// export const CategoryModel = MongooseModule.forFeature([
//   { name: CategoryModelName, schema: CategorySchema },
// ]);

export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: CategoryModelName,
    useFactory: (
      configService: ConfigService,
      fileUploadService: FileUploadService,
    ) => {
      CategorySchema.pre('save', function (next) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true });
        }
        return next();
      });

      CategorySchema.post(
        'deleteOne',
        { document: true, query: false },
        async function (doc, next) {
          const categoryFolder = doc.cloudFolder;
          const rootFolder = configService.get<string>('CLOUD_FOLDER_NAME');
          await fileUploadService.deleteFolder(
            `${rootFolder}/category/${categoryFolder}`,
          );
          next();
        },
      );

      return CategorySchema;
    },
    inject: [ConfigService, FileUploadService],
    imports: [FileUploadModule],
  },
]);

export type CategoryDocument = HydratedDocument<Category>;
