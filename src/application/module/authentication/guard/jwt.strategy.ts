import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthorizationManager from 'src/domain/authorization/authorization.manager';
import AuthService from '../../../../domain/authentication/auth.service';
import User from '../../../../domain/user/user';
import { jwtConstants } from '../auth.constants';
import JwtClaims from './jwt.claims';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtClaims): Promise<User> {
    const err = new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    if (!payload) {
      throw err;
    }
    const user: User | null = await this.authService.getUserById(payload.id);
    if (user) {
      AuthorizationManager.setUser(user);
      return user;
    }
    throw err;
  }
}
