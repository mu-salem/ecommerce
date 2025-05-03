import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { LoginDto } from '../auth/dto/login.dto';
import { comparehash } from 'src/common/security/hash.security';
import { UserDocument } from 'src/DB/Models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) {}
  async create(data: Partial<UserDocument>) {
    const { email } = data;
    await this._UserRepository.checkDuplicateAccount({ email });
    return await this._UserRepository.create({ ...data });
  }

  async validateUser(data: LoginDto) {
    const { email, password } = data;
    const user = await this._UserRepository.findOne({ filter: { email } });
    if (!user || !comparehash(password, user.password))
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async userExistByEmail(email: string) {
    const user = await this._UserRepository.findOne({ filter: { email } });
    return user;
  }

  async profile() {
    const user = await this._UserRepository.findOne({ filter: {} });

    return { data: user };
  }
}
