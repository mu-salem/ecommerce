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
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() data: CreateSubcategoryDto,
    @User('_id', ParseObjectIdPipe) userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.subcategoryService.create(data, userId, file);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseObjectIdPipe) subcategoryId: Types.ObjectId,
    @Body() data: UpdateSubcategoryDto,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.subcategoryService.update(subcategoryId, data, userId);
  }

  @Patch(':id/image')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('id', ParseObjectIdPipe) subcategoryId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.subcategoryService.updateImage(subcategoryId, file, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id', ParseObjectIdPipe) subcategoryId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.subcategoryService.remove(subcategoryId, userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) subcategoryId: Types.ObjectId) {
    return this.subcategoryService.findOne(subcategoryId);
  }

  @Get()
  @Public()
  findAll(@Query('page', ParseIntPipe) page: number) {
    return this.subcategoryService.findAll(page);
  }
}
