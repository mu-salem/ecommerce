import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import * as nanoid from 'nanoid';
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
    const cloudFolder = nanoid.nanoid();
    const results = await this._FileUploadService.saveFileToCloud(
      [file],
      `${rootFolder}/category/${cloudFolder}`,
    );

    const category = await this._CategoryRepository.create({
      name: data.name,
      image: results[0],
      createdBy: userId,
      cloudFolder,
    });

    return { data: category };
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
