import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { BrandRepository } from 'src/DB/repositories/brand.repository';
import { BrandModel } from 'src/DB/Models/brand.model';
import { CloudinaryProvider } from 'src/common/services/fileupload/cloudinary.provider';

@Module({
  imports: [BrandModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepository,
    FileUploadService,
    CloudinaryProvider,
  ],
  exports: [BrandRepository],
})
export class BrandModule {}
