import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { UserDocument, UserModelName } from '../Models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(@InjectModel(UserModelName) userModel: Model<UserDocument>) {
    super(userModel);
  }

  async checkDuplicateAccount(data: FilterQuery<UserDocument>) {
    const checkUser = await this.findOne({ filter: data });
    if (checkUser)
      throw new HttpException(
        'User already exists with the provided data',
        HttpStatus.CONFLICT,
      );
    return null;
  }
}
