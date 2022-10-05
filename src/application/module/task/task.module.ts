import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthenticationModule from '../authentication/auth.module';
import AuthorizationModule from '../authorization/authorization.module';
import { taskSchema } from '../../../infrastructure/persistence/task';
import UserModule from '../user/user.module';
import TaskController from './controller/task.controller';
import TaskRepository from '../../../domain/task/task.repository';
import TaskService from '../../../domain/task/task.service';
import TaskFactory from '../../../domain/task/task.factory';
import { userSchema } from '../../../infrastructure/persistence/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tasks', schema: taskSchema, collection: 'Tasks' },
      { name: 'Users', schema: userSchema, collection: 'Users' },
    ]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => AuthorizationModule),
    UserModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskFactory, TaskRepository],
  exports: [TaskFactory, TaskService],
})
export default class TaskModule {}
