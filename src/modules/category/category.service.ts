import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CategoryRepository } from 'src/DB/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly _FileUploadService: FileUploadService,
    private readonly _configService: ConfigService,
    private readonly _CategoryRepository: CategoryRepository,
  ) {}
  async create(
    data: CreateCategoryDto,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const rootFolder = this._configService.get<string>('CLOUD_FOLDER_NAME');
    const cloudFolder = uuidv4();
    const results = await this._FileUploadService.saveFileToCloud([file], {
      folder: `${rootFolder}/category/${cloudFolder}`,
    });

    const category = await this._CategoryRepository.create({
      name: data.name,
      image: results[0],
      createdBy: userId,
      cloudFolder,
    });

    return { data: category };
  }

  async update(
    categoryId: Types.ObjectId,
    data: UpdateCategoryDto,
    userId: Types.ObjectId,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found!`);

    if (data.name) {
      category.name = data.name;
      category.updatedBy = userId;
      await category.save();
    }

    return { data: category };
  }

  async updateImage(
    categoryId: Types.ObjectId,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found!`);

    const public_id = category.image.public_id;
    const results = await this._FileUploadService.saveFileToCloud([file], {
      public_id,
    });

    category.image = results[0];
    category.updatedBy = userId;
    await category.save();

    return { data: category };
  }

  async remove(categoryId: Types.ObjectId, userId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found!`);

    await category.deleteOne();

    return { massage: 'Category deleted' };
  }

  async findOne(categoryId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found!`);

    return { data: category };
  }

  async findAll(page: number) {
    return {
      data: await this._CategoryRepository.findAll({
        populate: [{ path: 'createdBy' }],
        paginate: { page },
      }),
    };
  }
}
