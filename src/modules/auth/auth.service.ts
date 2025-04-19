import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { subjects } from 'src/common/email/constants.email';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDto } from './dto/send-otp.dto';
import { OTPRepository } from 'src/DB/repositories/otp.repository';
import * as randomstring from 'randomstring';
import { comparehash } from 'src/common/security/hash.security';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _configService: ConfigService,
    private readonly _JWTService: JwtService,
    private readonly _OTPRepository: OTPRepository,
    private readonly _TokenRepository: TokenRepository,
  ) {}
  async register(data: CreateUserDto) {
    try {
      const { email, otp } = data;

      const otpDoc = await this._OTPRepository.findOne({ filter: { email } });
      if (!otpDoc || !comparehash(otp, otpDoc.otp))
        throw new NotFoundException('Invalid OTP!');

      await otpDoc.deleteOne();

      const user = await this._UserService.create({
        ...data,
        accountAcctivated: true,
      });

      return { success: true, message: 'User created', results: user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this._UserService.validateUser(data);

      const accessToken = this._JWTService.sign(
        { id: user._id },
        {
          secret: this._configService.get<string>('JWT_SECRET'),
          expiresIn: this._configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      );

      await this._TokenRepository.create({
        token: accessToken,
        user: user._id,
      });

      const refreshToken = this._JWTService.sign(
        { id: user._id },
        {
          secret: this._configService.get<string>('JWT_SECRET'),
          expiresIn: this._configService.get<string>(
            'REFRESH_TOKEN_EXPIRATION',
          ),
        },
      );

      await this._TokenRepository.create({
        token: refreshToken,
        user: user._id,
      });

      return { success: true, data: { accessToken, refreshToken } };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendOtp(data: SendOtpDto) {
    try {
      const { email } = data;
      const user = await this._UserService.userExistByEmail(email);
      if (user) throw new BadRequestException('User already exist');

      const otp = await this._OTPRepository.findOne({ filter: { email } });
      if (otp) await otp.deleteOne();

      const newOtp = randomstring.generate(6);

      this._MailerService.sendMail({
        to: email,
        subject: subjects.register,
        html: `Your OTP is ${newOtp}`,
      });

      return { success: true, message: 'OTP sent' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async forgetPassword(data: SendOtpDto) {
    try {
      const { email } = data;
      const user = await this._UserService.userExistByEmail(email);
      if (!user)
        throw new BadRequestException(
          'This email is not attached to any account',
        );

      if (!user.accountAcctivated)
        throw new BadRequestException('Your account is not activated yet!');

      const otp = await this._OTPRepository.findOne({ filter: { email } });
      if (otp) await otp.deleteOne();

      const newOtp = randomstring.generate(7);

      this._MailerService.sendMail({
        to: email,
        subject: subjects.resetPassword,
        html: `Your OTP is ${newOtp}`,
      });

      await this._OTPRepository.create({ email, otp: newOtp });

      return { success: true, message: 'Check your email!' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const { email, otp, password } = data;
      const user = await this._UserService.userExistByEmail(email);
      if (!user)
        throw new BadRequestException(
          'This email is not attached to any account',
        );

      if (!user.accountAcctivated)
        throw new BadRequestException('Your account is not activated yet!');

      const otpDoc = await this._OTPRepository.findOne({ filter: { email } });
      if (!otpDoc || !comparehash(otp, otpDoc.otp))
        throw new BadRequestException('Invalid OTP!');

      user.password = password;
      await user.save();

      const tokens = await this._TokenRepository.findAll({
        filter: { user: user._id },
      });

      if (tokens.data.length) {
        for (const token of tokens.data) {
          token.isValid = false;
          await token.save();
        }
      }

      return { success: true, message: 'Try to login now!' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
