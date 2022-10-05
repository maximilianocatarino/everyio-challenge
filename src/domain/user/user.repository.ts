import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocumentInterface } from '../../infrastructure/persistence/user';

@Injectable()
export default class UserRepository {
  constructor(
    @InjectModel('Users') private readonly model: Model<UserDocumentInterface>,
  ) {}

  async getUserByUsername(
    username: string,
  ): Promise<UserDocumentInterface | null> {
    return this.model.findOne({ username });
  }

  async createNewDocument(): Promise<UserDocumentInterface> {
    return new this.model();
  }

  async findById(id: string): Promise<UserDocumentInterface | null> {
    return this.model.findById(id);
  }
}
