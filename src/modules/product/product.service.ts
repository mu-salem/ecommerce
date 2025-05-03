import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/DB/repositories/Product.repository';
import { CategoryRepository } from 'src/DB/repositories/category.repository';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import { Image } from 'src/common/types/image.type';
import { FindProductDto } from './dto/find-product.dto';
import { ProductDocument } from 'src/DB/Models/product.model';
import { StockGateway } from '../socket/stock.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class ProductService {
  constructor(
    private readonly _ProductRepository: ProductRepository,
    private readonly _CategoryRepository: CategoryRepository,
    private readonly _FileUploadService: FileUploadService,
    private readonly _ConfigService: ConfigService,
    private readonly _StockGateway: StockGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(
    userId: Types.ObjectId,
    categoryId: Types.ObjectId,
    files: { thumbnail: Express.Multer.File[]; images?: Express.Multer.File[] },
    data: CreateProductDto,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found!`);

    const chackProduct = await this._ProductRepository.findOne({
      filter: { name: data.name, category: category._id },
    });
    if (chackProduct)
      throw new NotFoundException(
        `Product with name ${data.name} already exist`,
      );

    const cloudFolder = `${this._ConfigService.get<string>('CLOUD_FOLDER_NAME')}/product/${uuidv4()}`;

    const [thumbnail] = await this._FileUploadService.saveFileToCloud(
      files.thumbnail,
      {
        folder: cloudFolder,
      },
    );

    let images: Image[] | undefined;

    if (files.images) {
      images = await this._FileUploadService.saveFileToCloud(files.images, {
        folder: cloudFolder,
      });
    }

    const product = await this._ProductRepository.create({
      ...data,
      cloudFolder,
      createdBy: userId,
      category: category._id,
      thumbnail,
      ...(images && { images }),
    });

    return { data: product };
  }

  async update(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    data: UpdateProductDto,
  ) {
    const product = await this._ProductRepository.update({
      filter: { _id: productId, createdBy: userId },
      update: { ...data },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);

    return { message: 'Product updated successfully', data: product };
  }

  async removeImage(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    secure_url: string,
  ) {
    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
        createdBy: userId,
        $or: [
          { 'thumbnail.secure_url': secure_url },
          { 'images.secure_url': secure_url },
        ],
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);

    const { thumbnail, images } = product;

    if (thumbnail.secure_url === secure_url) {
      if (!images?.length) {
        throw new BadRequestException(
          `Can't remove the only existing image. Please upload another image!`,
        );
      }
      await this._FileUploadService.deleteFiles([thumbnail.public_id]);
      const lastImage = images[images.length - 1];
      product.thumbnail = lastImage;
      product.images.pop();
    } else {
      const imageToRemove = images.find(
        (image) => image.secure_url === secure_url,
      );

      await this._FileUploadService.deleteFiles([imageToRemove!.public_id]);
      product.images = images.filter(
        (image) => image.secure_url !== secure_url,
      );
    }

    await product.save();

    return { data: product };
  }

  async addImage(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    isThumbnail: boolean,
    image: Express.Multer.File,
  ) {
    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
        createdBy: userId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);

    if (!image) throw new BadRequestException(`Image is required!`);

    if (isThumbnail) {
      const [thumbnail] = await this._FileUploadService.saveFileToCloud(
        [image],
        {
          public_id: product.thumbnail.public_id,
        },
      );

      product.thumbnail = thumbnail;
    } else {
      const results = await this._FileUploadService.saveFileToCloud([image], {
        folder: product.cloudFolder,
      });

      product.images.push(results[0]);
    }

    await product.save();

    return { data: product };
  }

  async remove(productId: Types.ObjectId, userId: Types.ObjectId) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: productId, createdBy: userId },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);

    await product.deleteOne();

    return { message: 'Product deleted successfully' };
  }

  async findAll(query: FindProductDto) {
    const key = `products:${JSON.stringify(query)}`;
    const chached = await this.cacheManager.get(key);
    if (chached) return { data: chached };

    const products = await this._ProductRepository.findAll({
      filter: {
        ...(query.category && { category: new Types.ObjectId(query.category) }),
        ...(query.k && {
          $or: [
            { name: { $regex: query.k, $options: 'i' } },
            { description: { $regex: query.k, $options: 'i' } },
          ],
        }),
        ...(query.price && {
          finalPrice: {
            ...(query.price.min !== undefined && { $gte: query.price.min }),
            ...(query.price.max !== undefined && { $lte: query.price.max }),
          },
        }),
      },
      sort: {
        ...(query.sort?.by && {
          [query.sort.by]: query.sort.dir ? query.sort.dir : 1,
        }),
      },
      paginate: { page: query.page },
      populate: [{ path: 'category' }, { path: 'createdBy' }],
    });

    await this.cacheManager.set(key, products, 50000);

    return { data: products };
  }

  async checkProductExistence(productId: Types.ObjectId) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: productId },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);

    return product;
  }

  inStock(product: ProductDocument, requiredQuantity: number) {
    return product.stock >= requiredQuantity ? true : false;
  }

  async updateStock(
    productId: Types.ObjectId,
    quantity: number,
    increment: boolean,
  ) {
    const product = await this._ProductRepository.update({
      filter: { _id: productId },
      update: { $inc: { stock: increment ? quantity : -quantity } },
    });

    this._StockGateway.broadcastStockUpdate(product!._id, product!.stock);

    return product;
  }
}
