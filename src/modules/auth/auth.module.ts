import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OTPRepository } from 'src/DB/repositories/otp.repository';
import { OTPModel } from 'src/DB/Models/otp.model';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { TokenModel } from 'src/DB/Models/token.model';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from 'src/common/gurads/authentication.gurad';
import { RolesGuard } from 'src/common/gurads/authorization.gurad';

@Module({
  imports: [UserModule, OTPModel, TokenModel],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    OTPRepository,
    TokenRepository,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
