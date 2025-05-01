import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { UserModel } from 'src/DB/Models/user.model';
import { TokenModel } from 'src/DB/Models/token.model';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/DB/repositories/token.repository';

@Module({
  imports: [UserModel, TokenModel],
  providers: [UserService, UserRepository, JwtService, TokenRepository],
  exports: [UserService, UserRepository, TokenRepository],
  controllers: [UserController],
})
export class UserModule {}
