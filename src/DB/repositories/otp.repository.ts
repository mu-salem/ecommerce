import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTPDocument, OTPModelName } from '../Models/otp.model';

@Injectable()
export class OTPRepository extends AbstractRepository<OTPDocument> {
  constructor(@InjectModel(OTPModelName) OTPModel: Model<OTPDocument>) {
    super(OTPModel);
  }
}
