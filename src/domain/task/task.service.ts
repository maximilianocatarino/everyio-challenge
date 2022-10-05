import { Injectable, ForbiddenException } from '@nestjs/common';
import AuthorizationManager, {
  TaskAbilities,
} from '../authorization/authorization.manager';
import User from '../user/user';
import { TaskDocumentInterface } from 'src/infrastructure/persistence/task';
import Task, { TaskData } from './task';
import TaskRepository from './task.repository';
import TaskFactory from './task.factory';
import {
  getEnumByValue,
  TaskStatusEnum,
  taskStatusEnumDescripiton,
  taskStatusEnumValues,
} from './task.status.enum';
import InvalidResourceError from '../common/error/invalid.resource.error';
import TaskInvalidStatusError from './error/task.invalid.status.error';
import TaskAlreadyArchievedError from './error/task.already.archived.error';
import TaskInvalidDataError from './error/task.invalid.data.error';
import { Types } from 'mongoose';
import { UserDocumentInterface } from 'src/infrastructure/persistence/user';

@Injectable()
export default class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly taskFactory: TaskFactory,
    private readonly authorizatioManager: AuthorizationManager,
  ) {}

  private getUnauthorizedError(msg: string) {
    return new ForbiddenException(msg);
  }

  async getAll(params: object = {}): Promise<Task[]> {
    const canAccess = await this.authorizatioManager.can(TaskAbilities.READ);
    if (canAccess) {
      const docs: TaskDocumentInterface[] = await this.repository.find(params);
      const collection: Task[] = [];
      if (docs && docs instanceof Array) {
        docs.forEach((d) => {
          collection.push(this.taskFactory.createFromDocument(d));
        });
      }
      return Promise.resolve(collection);
    }
    throw this.getUnauthorizedError('Read permission required.');
  }

  async getById(id: string, user: User | null = null): Promise<Task | null> {
    let err: Error = this.getUnauthorizedError('Read permission required.');
    if (await this.authorizatioManager.can(TaskAbilities.READ)) {
      try {
        const doc: TaskDocumentInterface | null =
          await this.repository.findById(id);

        if (doc) {
          if (!user || user.getId() == doc.user.id) {
            return Promise.resolve(this.taskFactory.createFromDocument(doc));
          }
        }
      } catch (e) {}
      err = this.getInvalidResourceError();
    }
    throw err;
  }

  private async createTaskDocument(
    data: TaskData,
  ): Promise<TaskDocumentInterface> {
    const document: TaskDocumentInterface =
      await this.repository.createNewDocument();

    document.title = data.title;
    document.description = data.description;
    document.status = data.status;
    document.createdAt = new Date();
    return Promise.resolve(document);
  }

  private isNotArchieved(document: TaskDocumentInterface): boolean {
    return document.status != TaskStatusEnum.Archived;
  }

  private getInvalidResourceError(): InvalidResourceError {
    return new InvalidResourceError('The task is invalid ou not found.');
  }

  private getTaskAlreadyArchivedError(): TaskAlreadyArchievedError {
    return new TaskAlreadyArchievedError('The task is already archieved.');
  }

  async createTask(user: User, data: TaskData): Promise<Task> {
    const task: Task | null = this.taskFactory.createFromObjectForUser(
      user,
      data,
    );
    if (task) {
      const document = await this.createTaskDocument(data);
      document._id = new Types.ObjectId();
      document.user = user.toObject() as UserDocumentInterface;
      document.status = TaskStatusEnum.ToDo;
      await document.save();

      if (document._id) {
        task.setId(document._id?.toString());
        task.setStatus(document.status);
      }

      return Promise.resolve(task);
    }
    throw new TaskInvalidDataError(
      'The task fields title and description are required.',
    );
  }

  private getUpdateData(data: TaskData): object {
    const update: any = {};
    if (data.title) {
      update.title = data.title;
    }

    if (data.description) {
      update.description = data.description;
    }

    if (data.status) {
      update.status = data.status;
    }
    return update;
  }

  async updateTask(id: string, data: TaskData): Promise<Task> {
    const document: TaskDocumentInterface | null =
      await this.repository.findById(id);
    if (document) {
      if (this.isNotArchieved(document)) {
        Object.assign(document, this.getUpdateData(data));
        await document.save();
        const task: Task = this.taskFactory.createFromDocument(document);
        return Promise.resolve(task);
      }
      throw this.getTaskAlreadyArchivedError();
    }
    throw this.getInvalidResourceError();
  }

  async archiveTask(id: string): Promise<Task> {
    const document: TaskDocumentInterface | null =
      await this.repository.findById(id);
    if (document) {
      if (this.isNotArchieved(document)) {
        document.status = TaskStatusEnum.Archived;
        const archived = await document.save();
        if (archived) {
          const task = this.taskFactory.createFromDocument(archived);
          return Promise.resolve(task);
        }
      }
      throw this.getTaskAlreadyArchivedError();
    }
    throw this.getInvalidResourceError();
  }

  private getNextStatus(status: TaskStatusEnum): TaskStatusEnum | null {
    if (taskStatusEnumValues.includes(status + 1)) {
      return getEnumByValue(status + 1);
    }
    return null;
  }

  async nextStatus(id: string): Promise<Task> {
    const document: TaskDocumentInterface | null =
      await this.repository.findById(id);
    if (document) {
      const nextStatus = this.getNextStatus(document.status);
      if (nextStatus != null) {
        document.status = nextStatus;
        await document.save();
        const task = this.taskFactory.createFromDocument(document);
        return Promise.resolve(task);
      } else {
        if (!this.isNotArchieved(document)) {
          throw this.getTaskAlreadyArchivedError();
        }
        throw new TaskInvalidStatusError(
          `The next task status is invalid. Curentlly ${
            taskStatusEnumDescripiton[document.status]
          }`,
        );
      }
    }
    throw this.getInvalidResourceError();
  }
}
