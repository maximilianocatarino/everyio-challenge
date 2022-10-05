import { Injectable } from '@nestjs/common';
import { defineAbility } from '@casl/ability';
import User from '../user/user';
import { AuthUser } from '../../application/module/authentication/decorator/auth.decorators';
import PermissionRepository from './permission.repository';
import { PermissionDocumentInterface } from 'src/infrastructure/persistence/permission';

const TASK = 'Task';

export enum Resources {
  TASK,
}

export enum TaskAbilities {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  ARCHIVE = 'archive',
}

@Injectable()
export default class AuthorizationManager {
  private checker: any;
  private collection: PermissionDocumentInterface[] = [];
  public static user: User;

  constructor(private readonly repository: PermissionRepository) {
    this.initialize();
  }

  static setUser(user: User): void {
    AuthorizationManager.user = user;
  }

  private async initialize(): Promise<void> {
    const user: User = AuthorizationManager.user;
    if (user != null) {
      this.collection = await this.repository.getPermissionsByUserId(
        user.getId(),
      );
    }
    this.checker = defineAbility((can) => {
      if (user != null) {
        this.collection.forEach((element) => {
          can(element.ability, element.resource, {
            authorId: user.getId(),
          });
        });
      }
    });
  }

  async can(ability: string): Promise<boolean> {
    await this.initialize();
    return this.checker.can(ability.toUpperCase(), TASK.toUpperCase());
  }
}
