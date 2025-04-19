import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OTPRepository } from 'src/DB/repositories/otp.repository';
import { OTPModel } from 'src/DB/Models/otp.model';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { TokenModel } from 'src/DB/Models/token.model';

@Module({
  imports: [UserModule, OTPModel, TokenModel],
  controllers: [AuthController, JwtService, OTPRepository, TokenRepository],
  providers: [AuthService],
})
export class AuthModule {}
