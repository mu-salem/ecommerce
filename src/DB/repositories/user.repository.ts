import { ConflictException, Injectable } from '@nestjs/common';
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
    if (checkUser) {
      throw new ConflictException({
        message: 'User already exists',
        details: {
          email: data.email,
        },
      });
    }
    return null;
  }
}
