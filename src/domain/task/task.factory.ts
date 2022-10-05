import { Injectable } from '@nestjs/common';
import EntityFactory from '../common/interface/entity.factory';
import { TaskDocumentInterface } from '../../infrastructure/persistence/task';
import Task, { TaskData } from './task';
import UserFactory from '../user/user.factory';
import User from '../user/user';

@Injectable()
export default class TaskFactory
  implements EntityFactory<TaskDocumentInterface, Task>
{
  constructor(private readonly userFactory: UserFactory) {}

  createTaskBaseObject(d: object): Task {
    const data: TaskData = d as TaskData;
    const task = new Task();
    if (data.id) {
      task.setId(data.id);
    }

    task.setTitle(data.title);
    task.setDescription(data.description);
    task.setCreatedAt(data.createdAt);

    if (data.updatedAt) {
      task.setUpdatedAt(data.updatedAt);
    }

    return task;
  }

  createFromObjectForUser(user: User, d: object): Task | null {
    const task: Task = this.createTaskBaseObject(d);
    task.setUser(user);
    return task;
  }

  createFromObject(d: object): Task {
    const data: TaskData = d as TaskData;
    const task: Task = this.createTaskBaseObject(d);
    if (data.user) {
      const user = this.userFactory.createFromObject(data.user);
      if (user != null) {
        task.setUser(user);
      }
    }
    return task;
  }

  createFromDocument(document: TaskDocumentInterface): Task {
    const task = new Task();
    if (document._id) {
      task.setId(document._id.toString());
    }
    task.setUser(this.userFactory.createFromDocument(document.user));
    task.setTitle(document.title);
    task.setDescription(document.description);
    task.setStatus(document.status);
    task.setCreatedAt(document.createdAt);

    return task;
  }
}
