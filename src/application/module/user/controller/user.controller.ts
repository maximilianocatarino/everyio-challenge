import { Controller, Get } from '@nestjs/common';
import UserService from '../../../../domain/user/user.service';

@Controller('user')
export default class UserController {
  constructor(protected readonly service: UserService) {}

  @Get('feed')
  async userFeed(): Promise<object[]> {
    return Promise.resolve([]);
  }
}
