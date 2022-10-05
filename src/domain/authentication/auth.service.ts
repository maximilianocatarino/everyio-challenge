import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from '../user/user';
import UserService from '../user/user.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createJwt(user: User): Promise<object> {
    return {
      access_token: this.jwtService.sign(user.toObject()),
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }
}
