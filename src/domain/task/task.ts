import Entity, { EntityData, EntityInterface } from '../common/entity';
import { UserData, UserInterface } from '../user/user';
import { TaskStatusEnum } from './task.status.enum';

export enum TaskStatus {
  ToDo = 1,
  InProgress = 2,
  Done = 3,
  Archived = 4,
}

export interface TaskData extends EntityData {
  id: string;
  user: UserData;
  title: string;
  description: string;
  status: TaskStatusEnum;
}

export interface TaskInterface extends EntityInterface {
  getId(): string;
  setId(id: string): void;

  getUser(): UserInterface;
  setUser(user: UserInterface): void;

  getTitle(): string;
  setTitle(title: string): void;

  getDescription(): string;
  setDescription(message: string): void;

  getStatus(): TaskStatusEnum;
  setStatus(status: TaskStatusEnum): void;
}

export default class Task extends Entity implements TaskInterface {
  private user: UserInterface;
  private title: string;
  private description: string;
  private status: TaskStatusEnum;

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getUser(): UserInterface {
    return this.user;
  }

  setUser(user: UserInterface): void {
    this.user = user;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getStatus(): TaskStatusEnum {
    return this.status;
  }

  setStatus(status: TaskStatusEnum): void {
    this.status = status;
  }

  toObject(): object {
    return {
      id: this.getId(),
      user: this.user ? this.user.toObject() : {},
      title: this.title,
      description: this.description,
      status: this.status,
    };
  }

  serialize(): object {
    return this.toObject();
  }
}
