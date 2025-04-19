import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('send-otp')
  sendOtp(@Body() data: SendOtpDto) {
    return this.authService.sendOtp(data);
  }

  @Post('forgot-password')
  forgotPassword(@Body() data: SendOtpDto) {
    return this.authService.forgetPassword(data);
  }

  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
