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
import { CategoryModelName } from './category.model';

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'SubCategory_name_index' },
  })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  image: Image;

  @Prop({ type: String })
  cloudFolder: string;

  @Prop({ type: Types.ObjectId, ref: CategoryModelName, required: true })
  category: Types.ObjectId;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

export const SubCategoryModelName = SubCategory.name;

// export const SubCategoryModel = MongooseModule.forFeature([
//   { name: SubCategoryModelName, schema: SubCategorySchema },
// ]);

export const SubCategoryModel = MongooseModule.forFeatureAsync([
  {
    name: SubCategoryModelName,
    useFactory: (
      configService: ConfigService,
      fileUploadService: FileUploadService,
    ) => {
      SubCategorySchema.pre('save', function (next) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true });
        }
        return next();
      });
      SubCategorySchema.post(
        'deleteOne',
        { document: true, query: false },
        async function (doc, next) {
          const catagoryFolder = doc.cloudFolder;
          const rootFolder = configService.get<string>('CLOUD_FOLDER_NAME');
          await fileUploadService.deleteFolder(
            `${rootFolder}/SubCategory/${catagoryFolder}`,
          );
        },
      );
      return SubCategorySchema;
    },
    inject: [ConfigService, FileUploadService],
    imports: [FileUploadModule],
  },
]);

export type SubCategoryDocument = HydratedDocument<SubCategory>;
