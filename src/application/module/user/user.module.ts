import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthenticationModule from '../authentication/auth.module';
import UserService from '../../../domain/user/user.service';
import UserRepository from '../../../domain/user/user.repository';
import UserFactory from '../../../domain/user/user.factory';
import { userSchema } from '../../../infrastructure/persistence/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: userSchema, collection: 'Users' },
    ]),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [UserRepository, UserService, UserFactory],
  exports: [UserFactory, UserRepository, UserService],
})
export default class UserModule {}
