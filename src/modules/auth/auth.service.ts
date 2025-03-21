import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { subjects } from 'src/common/email/constants.email';
import { signUp } from 'src/common/email/Template.email';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}
  async register(data: CreateUserDto) {
    try {
      const { email } = data;
      this._MailerService.sendMail({
        from: this._configService.get<string>('EMAIL'),
        to: email,
        subject: subjects.register,
        html: signUp(email),
      });
      const user = await this._UserService.create({ ...data });
      return { success: true, message: 'User created', results: user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
