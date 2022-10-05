import * as Bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import User, { UserData } from './user';
import UserRepository from './user.repository';
import UserFactory from './user.factory';
import { UserDocumentInterface } from '../../infrastructure/persistence/user';

@Injectable()
export default class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly factory: UserFactory,
  ) {}

  async login(username: string, password: string): Promise<User | null> {
    const userDoc: UserDocumentInterface | null =
      await this.repository.getUserByUsername(username);
    if (userDoc != null && userDoc.password) {
      const isValid = await Bcrypt.compare(password, userDoc.password);
      if (isValid) {
        return Promise.resolve(this.factory.createFromDocument(userDoc));
      }
    }
    return Promise.resolve(null);
  }

  async createDocumentFromUserData(
    data: UserData,
  ): Promise<UserDocumentInterface> {
    const document: UserDocumentInterface =
      await this.repository.createNewDocument();

    document.name = data.name;
    document.email = data.email;
    document.username = data.username;

    if (data.id != null) {
      document._id = new Types.ObjectId(data.id);
    }

    if (data.password) {
      document.password = data.password;
    }

    if (data.salt) {
      document.salt = data.salt;
    }

    if (data.createdAt) {
      document.createdAt = data.createdAt;
    }

    if (data.updatedAt) {
      document.updateddAt = data.updatedAt;
    }

    return Promise.resolve(document);
  }

  createUserFromObject(data: UserData): User | null {
    return this.factory.createFromObject(data);
  }

  async getUserById(id: string): Promise<User | null> {
    const document = await this.repository.findById(id);
    if (document) {
      return Promise.resolve(this.factory.createFromDocument(document));
    }
    return Promise.resolve(null);
  }
}
