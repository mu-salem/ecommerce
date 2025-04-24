import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from 'src/common/constants/constants';
import {
  v2 as Cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { Image } from 'src/common/types/image.type';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadCloud(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          return resolve(result as UploadApiResponse);
        })
        .end(buffer);
    });
  }

  async saveFileToCloud(
    files: Express.Multer.File[],
    options: UploadApiOptions,
  ) {
    const saveFiles: Image[] = [];
    for (const file of files) {
      const buffer = file.buffer;
      const { secure_url, public_id } = await this.uploadCloud(buffer, options);
      saveFiles.push({ secure_url, public_id });
    }
    return saveFiles;
  }

  async deleteFiles(publicIds: string[]) {
    await this.cloudinary.api.delete_resources(publicIds);
  }

  async deleteFolder(folderPath: string) {
    await this.cloudinary.api.delete_resources_by_prefix(folderPath);

    const subFolders = await this.cloudinary.api.sub_folders(folderPath);

    if (subFolders.folders.length) {
      for (const subFolder of subFolders.folders) {
        await this.deleteFolder(subFolder.path);
      }
    }

    await this.cloudinary.api.delete_folder(folderPath);
  }
}
