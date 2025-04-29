import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RequiredThumbnailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !value.thumbnail)
      throw new BadRequestException('Thumbnail is required');

    return value;
  }
}
