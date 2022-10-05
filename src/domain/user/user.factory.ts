import { Injectable } from '@nestjs/common';
import EntityFactory from '../common/interface/entity.factory';
import { UserDocumentInterface } from '../../infrastructure/persistence/user';
import User, { UserData } from './user';

@Injectable()
export default class UserFactory
  implements EntityFactory<UserDocumentInterface, User>
{
  createFromObject(d: object): User | null {
    const data: UserData = d as UserData;
    const user = new User();

    if (data.id) {
      user.setId(data.id);
    }

    user.setName(data.name);
    user.setEmail(data.email);
    user.setUsername(data.username);

    if (data.updatedAt) {
      user.setUpdatedAt(data.updatedAt);
    }

    return user;
  }

  createFromDocument(document: UserDocumentInterface): User {
    const user = new User();
    if (document._id) {
      user.setId(document._id.toString());
    }
    user.setName(document.name);
    user.setEmail(document.email);
    user.setUsername(document.username);

    if (document.password) {
      user.setPassword(document.password);
    }
    if (document.salt) {
      user.setSalt(document.salt);
    }
    user.setCreatedAt(document.createdAt);

    return user;
  }
}
