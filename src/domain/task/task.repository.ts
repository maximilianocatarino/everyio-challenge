import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocumentInterface } from '../../infrastructure/persistence/task';

@Injectable()
export default class TaskRepository {
  constructor(
    @InjectModel('Tasks') readonly model: Model<TaskDocumentInterface>,
  ) {}

  async findById(id: string): Promise<TaskDocumentInterface | null> {
    return this.model.findById(id);
  }

  async find(params: object): Promise<TaskDocumentInterface[]> {
    return this.model.find(params);
  }

  async createNewDocument(): Promise<TaskDocumentInterface> {
    return new this.model();
  }
}
