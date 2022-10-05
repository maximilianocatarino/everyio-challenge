import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import AuthenticationModule from './authentication/auth.module';
import AuthorizationModule from './authorization/authorization.module';
import TaskModule from './task/task.module';
import UserModule from './user/user.module';
import SeederModule from './seeder/seeder.module';

const dbUser = process.env.MONGODB_USER ?? 'root';
const dbPassword = process.env.MONGODB_PASSWORD ?? 'rootpassword';
const dbHost = process.env.MONGODB_HOST ?? 'localhost';
const dbPort = process.env.MONGODB_PORT ?? '27017';
const database = process.env.MONGODB_DATABASE ?? 'admin';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${database}`,
    ),
    CommandModule,
    AuthenticationModule,
    AuthorizationModule,
    TaskModule,
    UserModule,
    SeederModule,
  ],
})
export class AppModule {}
