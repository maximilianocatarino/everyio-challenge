import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthService from '../../../domain/authentication/auth.service';
import User from '../../../domain/user/user';
import { AuthUser } from './decorator/auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@AuthUser() user: User) {
    if (user) {
      return this.authService.createJwt(user);
    }
    throw new HttpException(
      'Invalid username or password.',
      HttpStatus.UNAUTHORIZED,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@AuthUser() user: User) {
    return Promise.resolve(user.toObject());
  }
}
