import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { SubCategoryRepository } from 'src/DB/repositories/subCategory.repository';
import { SubCategoryModel } from 'src/DB/Models/subCategory.model';
import { CloudinaryProvider } from 'src/common/services/fileupload/cloudinary.provider';

@Module({
  imports: [SubCategoryModel],
  controllers: [SubcategoryController],
  providers: [
    SubcategoryService,
    SubCategoryRepository,
    FileUploadService,
    CloudinaryProvider,
  ],
  exports: [SubCategoryRepository],
})
export class SubcategoryModule {}
