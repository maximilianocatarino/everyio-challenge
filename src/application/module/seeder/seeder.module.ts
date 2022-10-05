import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { permissionSchema } from 'src/infrastructure/persistence/permission';
import { userSchema } from '../../../infrastructure/persistence/user';
import SeederService from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: userSchema, collection: 'Users' },
      {
        name: 'Permissions',
        schema: permissionSchema,
        collection: 'Permissions',
      },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export default class SeederModule {}
