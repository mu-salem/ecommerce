import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() data: CreateCategoryDto,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.create(data, userId, file);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) categoryId: Types.ObjectId,
    @Body() data: UpdateCategoryDto,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.update(categoryId, data, userId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id', ParseObjectIdPipe) categoryId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateImage(categoryId, file, userId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) categoryId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.remove(categoryId, userId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) categoryId: Types.ObjectId) {
    return this.categoryService.findOne(categoryId);
  }
  @Public()
  @Get()
  async findAll(@Query('page', ParseIntPipe) page: number) {
    return this.categoryService.findAll(page);
  }
}
