import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { UserModel } from 'src/DB/Models/user.model';

@Module({
  imports: [UserModel],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
