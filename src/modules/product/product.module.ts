import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/DB/repositories/Product.repository';
import { ProductModel } from 'src/DB/Models/product.model';
import { CategoryModule } from '../category/category.module';
import { FileUploadModule } from 'src/common/services/fileupload/fileupload.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  imports: [ProductModel, CategoryModule, FileUploadModule, SocketModule],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
