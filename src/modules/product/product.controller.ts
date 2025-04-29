import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'src/DB/enums/user.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { RequiredThumbnailPipe } from './pipes/Required-thumbnail.pipe';
import { RemoveImageDto } from './dto/remove-image.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FindProductDto } from './dto/find-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.SELLER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  @Post(':categoryId')
  async create(
    @User('_id') userId: Types.ObjectId,
    @Param('categoryId', ParseObjectIdPipe) categoryId: Types.ObjectId,
    @UploadedFiles(RequiredThumbnailPipe)
    files: { thumbnail: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() data: CreateProductDto,
  ) {
    return this.productService.create(userId, categoryId, files, data);
  }

  @Roles(Role.SELLER)
  @Patch(':id')
  async update(
    @User('_id') userId: Types.ObjectId,
    @Param('id', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.update(userId, productId, data);
  }

  @Roles(Role.SELLER)
  @Patch(':id/remove-image')
  async removeImage(
    @User('_id') userId: Types.ObjectId,
    @Param('id', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() data: RemoveImageDto,
  ) {
    return this.productService.removeImage(userId, productId, data.secure_url);
  }

  @Roles(Role.SELLER)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id/add-image')
  async addImage(
    @User('_id') userId: Types.ObjectId,
    @Param('id', ParseObjectIdPipe) productId: Types.ObjectId,
    @UploadedFile() image: Express.Multer.File,
    @Query('isThumbnail', ParseBoolPipe) isThumbnail: boolean,
  ) {
    return this.productService.addImage(userId, productId, isThumbnail, image);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @Delete(':id')
  async remove(
    @User('_id') userId: Types.ObjectId,
    @Param('id', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productService.remove(productId, userId);
  }

  @Public()
  @Get()
  async findAll(@Query() query: FindProductDto) {
    return this.productService.findAll(query);
  }
}
