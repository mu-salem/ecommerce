import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() data: CreateBrandDto,
    @User('_id', ParseObjectIdPipe) userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.create(data, userId, file);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseObjectIdPipe) brandId: Types.ObjectId,
    @Body() data: UpdateBrandDto,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.brandService.update(brandId, data, userId);
  }

  @Patch(':id/image')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('id', ParseObjectIdPipe) brandId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.updateImage(brandId, file, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id', ParseObjectIdPipe) brandId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.brandService.remove(brandId, userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) brandId: Types.ObjectId) {
    return this.brandService.findOne(brandId);
  }

  @Get()
  @Public()
  findAll(@Query('page', ParseIntPipe) page: number) {
    return this.brandService.findAll(page);
  }
}
