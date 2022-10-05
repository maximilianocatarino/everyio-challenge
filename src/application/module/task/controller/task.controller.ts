import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../../authentication/decorator/auth.decorators';
import User from 'src/domain/user/user';
import Task, { TaskData } from '../../../../domain/task/task';
import Factory from '../../../../domain/task/task.factory';
import TaskService from '../../../../domain/task/task.service';
import TaskInvalidStatusError from '../../../../domain/task/error/task.invalid.status.error';
import TaskAlreadyArchievedError from '../../../../domain/task/error/task.already.archived.error';

@UseGuards(AuthGuard('jwt'))
@Controller()
export default class TaskController {
  constructor(
    private readonly service: TaskService,
    private readonly factory: Factory,
  ) {}

  private static collectionToObjectCollection(data: Task[]): object[] {
    const collection: object[] = [];
    data.forEach((e) => collection.push(e.toObject()));
    return collection;
  }

  private getNotFoundError(): HttpException {
    return new HttpException(
      'Task is invalid or not found.',
      HttpStatus.NOT_FOUND,
    );
  }

  @Get('task')
  async getAll(@AuthUser() user: User) {
    const data: Task[] = await this.service.getAll({ userId: user.getId() });
    return TaskController.collectionToObjectCollection(data);
  }

  @Get('task/:id')
  async getById(@AuthUser() user: User, @Param('id') id: string) {
    try {
      const task: Task | null = await this.service.getById(id);
      if (task) {
        return task.toObject();
      }
    } catch (e) {}
    throw this.getNotFoundError();
  }

  @Post('task')
  async createTask(@AuthUser() user: User, @Body() payload: TaskData) {
    const task: Task = await this.service.createTask(user, payload);
    return task.toObject();
  }

  @Put('task/:id')
  async updateTask(@Param('id') id: string, @Body() taskData: TaskData) {
    try {
      const task: Task = await this.service.updateTask(id, taskData);
      if (task) {
        return task.toObject();
      }
    } catch (e) {
      console.log;
    }
    throw this.getNotFoundError();
  }

  @Patch('task:next-status/:id')
  async nextTaskStatus(@Param('id') id: string) {
    let err: Error = this.getNotFoundError();

    try {
      const task: Task = await this.service.nextStatus(id);
      if (task) {
        return task.toObject();
      }
    } catch (e) {
      if (e instanceof TaskInvalidStatusError) {
        err = new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }

    throw err;
  }

  @Delete(':id')
  async archiveTask(@Param('id') id: string) {
    let err: Error = this.getNotFoundError();

    try {
      const task: Task = await this.service.archiveTask(id);
      if (task) {
        return task.toObject();
      }
    } catch (e) {
      if (e instanceof TaskAlreadyArchievedError) {
        err = new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }

    throw err;
  }
}
