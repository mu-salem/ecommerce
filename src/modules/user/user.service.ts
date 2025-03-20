import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from 'src/DB/repositories/user.repository';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) {}
  async create(data: CreateUserDto) {
    const { email } = data;
    await this._UserRepository.checkDuplicateAccount({ email });
    return await this._UserRepository.create({ ...data });
  }
}
