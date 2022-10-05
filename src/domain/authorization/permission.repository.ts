import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PermissionDocumentInterface } from '../../infrastructure/persistence/permission';

@Injectable()
export default class PermissionRepository {
  constructor(
    @InjectModel('Permissions')
    private readonly model: Model<PermissionDocumentInterface>,
  ) {}

  async getPermissionsByUserId(
    userId: string,
  ): Promise<PermissionDocumentInterface[]> {
    return this.model.find({ userId: new Types.ObjectId(userId) });
  }
}
