import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from 'src/common/constants/constants';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
import { Image } from 'src/common/types/image.type';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadCloud(
    buffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) return reject(error);
          return resolve(result as UploadApiResponse);
        })
        .end(buffer);
    });
  }

  async saveFileToCloud(files: Express.Multer.File[], folder: string) {
    const saveFiles: Image[] = [];
    for (const file of files) {
      const buffer = file.buffer;
      const { secure_url, public_id } = await this.uploadCloud(buffer, folder);
      saveFiles.push({ secure_url, public_id });
    }
    return saveFiles;
  }
}
