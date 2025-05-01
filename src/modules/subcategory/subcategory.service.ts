import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SubCategoryRepository } from 'src/DB/repositories/subCategory.repository';

@Injectable()
export class SubcategoryService {
  constructor(
    private readonly _FileUploadService: FileUploadService,
    private readonly _configService: ConfigService,
    private readonly _SubCategoryRepository: SubCategoryRepository,
  ) {}

  async create(
    data: CreateSubcategoryDto,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const rootFolder = this._configService.get<string>('CLOUD_FOLDER_NAME');
    const cloudFolder = uuidv4();
    const results = await this._FileUploadService.saveFileToCloud([file], {
      folder: `${rootFolder}/SubCategory/${cloudFolder}`,
    });

    const subcategory = await this._SubCategoryRepository.create({
      name: data.name,
      image: results[0],
      createdBy: userId,
      updatedBy: userId,
      category: data.category,
      cloudFolder,
    });

    return { data: subcategory };
  }

  async update(
    subcategoryId: Types.ObjectId,
    data: UpdateSubcategoryDto,
    userId: Types.ObjectId,
  ) {
    const subcategory = await this._SubCategoryRepository.findOne({
      filter: { _id: subcategoryId },
    });

    if (!subcategory)
      throw new NotFoundException(
        `Subcategory with id ${subcategoryId} not found!`,
      );

    if (data.name) subcategory.name = data.name;
    if (data.category) subcategory.category = data.category;
    subcategory.updatedBy = userId;

    await subcategory.save();
    return { data: subcategory };
  }

  async updateImage(
    subcategoryId: Types.ObjectId,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const subcategory = await this._SubCategoryRepository.findOne({
      filter: { _id: subcategoryId },
    });

    if (!subcategory)
      throw new NotFoundException(
        `Subcategory with id ${subcategoryId} not found!`,
      );

    const public_id = subcategory.image.public_id;
    const results = await this._FileUploadService.saveFileToCloud([file], {
      public_id,
    });

    subcategory.image = results[0];
    subcategory.updatedBy = userId;
    await subcategory.save();

    return { data: subcategory };
  }

  async remove(subcategoryId: Types.ObjectId, userId: Types.ObjectId) {
    const subcategory = await this._SubCategoryRepository.findOne({
      filter: { _id: subcategoryId },
    });

    if (!subcategory)
      throw new NotFoundException(
        `Subcategory with id ${subcategoryId} not found!`,
      );

    await subcategory.deleteOne();
    return { message: 'Subcategory deleted' };
  }

  async findOne(subcategoryId: Types.ObjectId) {
    const subcategory = await this._SubCategoryRepository.findOne({
      filter: { _id: subcategoryId },
    });

    if (!subcategory)
      throw new NotFoundException(
        `Subcategory with id ${subcategoryId} not found!`,
      );

    return { data: subcategory };
  }

  async findAll(page: number) {
    return {
      data: await this._SubCategoryRepository.findAll({
        paginate: { page },
        populate: [{ path: 'category' }, { path: 'createdBy' }],
      }),
    };
  }
}
