import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from '../authentication/auth.module';
import UserModule from '../user/user.module';
import User from 'src/domain/user/user';
import { permissionSchema } from 'src/infrastructure/persistence/permission';
import AuthorizationManager from '../../../domain/authorization/authorization.manager';
import PermissionRepository from '../../../domain/authorization/permission.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Permissions',
        schema: permissionSchema,
        collection: 'Permissions',
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  providers: [AuthorizationManager, PermissionRepository, User],
  exports: [AuthorizationManager],
})
export default class AuthorizationModule {}
