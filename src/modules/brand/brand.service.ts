import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { BrandRepository } from 'src/DB/repositories/brand.repository';

@Injectable()
export class BrandService {
  constructor(
    private readonly _FileUploadService: FileUploadService,
    private readonly _configService: ConfigService,
    private readonly _BrandRepository: BrandRepository,
  ) {}

  async create(
    data: CreateBrandDto,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const rootFolder = this._configService.get<string>('CLOUD_FOLDER_NAME');
    const cloudFolder = uuidv4();
    const results = await this._FileUploadService.saveFileToCloud([file], {
      folder: `${rootFolder}/Brand/${cloudFolder}`,
    });

    const brand = await this._BrandRepository.create({
      name: data.name,
      image: results[0],
      createdBy: userId,
      updatedBy: userId,
      subCategory: data.subCategory,
      cloudFolder,
    });

    return { data: brand };
  }

  async update(
    brandId: Types.ObjectId,
    data: UpdateBrandDto,
    userId: Types.ObjectId,
  ) {
    const brand = await this._BrandRepository.findOne({
      filter: { _id: brandId },
    });
    if (!brand)
      throw new NotFoundException(`Brand with id ${brandId} not found!`);

    if (data.name) brand.name = data.name;
    if (data.subCategory) brand.subCategory = data.subCategory;
    brand.updatedBy = userId;
    await brand.save();

    return { data: brand };
  }

  async updateImage(
    brandId: Types.ObjectId,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const brand = await this._BrandRepository.findOne({
      filter: { _id: brandId },
    });
    if (!brand)
      throw new NotFoundException(`Brand with id ${brandId} not found!`);

    const public_id = brand.image.public_id;
    const results = await this._FileUploadService.saveFileToCloud([file], {
      public_id,
    });

    brand.image = results[0];
    brand.updatedBy = userId;
    await brand.save();

    return { data: brand };
  }

  async remove(brandId: Types.ObjectId, userId: Types.ObjectId) {
    const brand = await this._BrandRepository.findOne({
      filter: { _id: brandId },
    });
    if (!brand)
      throw new NotFoundException(`Brand with id ${brandId} not found!`);

    await brand.deleteOne();
    return { message: 'Brand deleted' };
  }

  async findOne(brandId: Types.ObjectId) {
    const brand = await this._BrandRepository.findOne({
      filter: { _id: brandId },
    });
    if (!brand)
      throw new NotFoundException(`Brand with id ${brandId} not found!`);

    return { data: brand };
  }

  async findAll(page: number) {
    return {
      data: await this._BrandRepository.findAll({
        paginate: { page },
        populate: [{ path: 'subCategory' }, { path: 'createdBy' }],
      }),
    };
  }
}
