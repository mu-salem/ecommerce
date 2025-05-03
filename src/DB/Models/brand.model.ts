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
import { SubCategoryModelName } from './subCategory.model';

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'Brand_name_index' },
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

  @Prop({ type: Types.ObjectId, ref: SubCategoryModelName, required: true })
  subCategory: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModelName = Brand.name;

// export const BrandModel = MongooseModule.forFeature([
//   { name: BrandModelName, schema: BrandSchema },
// ]);

export const BrandModel = MongooseModule.forFeatureAsync([
  {
    name: BrandModelName,
    useFactory: (
      configService: ConfigService,
      fileUploadService: FileUploadService,
    ) => {
      BrandSchema.pre('save', function (next) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true });
        }
        return next();
      });
      BrandSchema.post(
        'deleteOne',
        { document: true, query: false },
        async function (doc, next) {
          const catagoryFolder = doc.cloudFolder;
          const rootFolder = configService.get<string>('CLOUD_FOLDER_NAME');
          await fileUploadService.deleteFolder(
            `${rootFolder}/Brand/${catagoryFolder}`,
          );
        },
      );
      return BrandSchema;
    },
    inject: [ConfigService, FileUploadService],
    imports: [FileUploadModule],
  },
]);

export type BrandDocument = HydratedDocument<Brand>;
