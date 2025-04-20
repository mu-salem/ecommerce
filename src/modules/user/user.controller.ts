import { AuthenticationGuard } from 'src/common/gurads/authentication.gurad';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AuthenticationGuard)
  profile() {
    return this.userService.profile();
  }
}
