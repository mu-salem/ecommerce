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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Param('id') categoryId: Types.ObjectId,
    @Body() data: UpdateCategoryDto,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.update(categoryId, data, userId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id') categoryId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateImage(categoryId, file, userId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
