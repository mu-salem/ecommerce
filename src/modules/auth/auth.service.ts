import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly _UserService: UserService) {}
  register(data: CreateUserDto) {
    try {
      // const { email } = data;
      const user = this._UserService.create({ ...data });
      return { success: true, message: 'User created', results: user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
