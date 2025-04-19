import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn([Math.random], { message: 'Password must match!' })
  @ValidateIf((obj: CreateUserDto) => obj.password !== obj.confirmPassword)
  confirmPassword: string;
}
