import { Module } from '@nestjs/common';
import { FileUploadService } from './fileupload.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [FileUploadService, CloudinaryProvider],
  exports: [FileUploadService, CloudinaryProvider],
})
export class FileUploadModule {}
