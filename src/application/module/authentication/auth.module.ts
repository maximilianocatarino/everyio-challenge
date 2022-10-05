import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import UserModeule from '../user/user.module';
import LocalStrategy from './guard/local.strategy';
import LocalAuthGuard from './guard/local.auth.guard';
import JwtStrategy from './guard/jwt.strategy';
import JwtAuthGuard from './guard/jwt.auth.guard';
import AuthService from '../../../domain/authentication/auth.service';
import { userSchema } from '../../../infrastructure/persistence/user';
import { jwtConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import AuthorizationModule from '../authorization/authorization.module';

const passportModule = PassportModule.register({
  property: 'user',
  session: false,
});

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: userSchema, collection: 'Users' },
    ]),
    passportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expires,
      },
    }),
    forwardRef(() => AuthorizationModule),
    UserModeule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [passportModule],
})
export default class AuthenticationModule {}
