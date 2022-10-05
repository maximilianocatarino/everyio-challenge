import * as Bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command } from 'nestjs-command';
import { UserDocumentInterface } from '../../../infrastructure/persistence/user';
import { PermissionDocumentInterface } from '../../../infrastructure/persistence/permission';

@Injectable()
export default class SeederService {
  private saltList: string[] = [];
  private passwordList: string[] = [];
  private idList: Types.ObjectId[] = [];
  private promises: Promise<any>[] = [];

  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<UserDocumentInterface>,
    @InjectModel('Permissions')
    private readonly permissionModel: Model<PermissionDocumentInterface>,
  ) {}

  seedUsers() {
    this.idList.push(new Types.ObjectId());
    this.idList.push(new Types.ObjectId());
    const data = [
      {
        _id: this.idList[0],
        name: 'John Doe',
        email: 'john.doe@domain.com',
        username: 'john.doe',
        password: this.passwordList[0],
        salt: this.saltList[0],
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
      {
        _id: this.idList[1],
        name: 'Cris Black',
        email: 'cris.black@domain.com',
        username: 'cris.black',
        password: this.passwordList[1],
        salt: this.saltList[1],
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
    ];

    const doc1 = new this.userModel();
    Object.assign(doc1, data[0]);
    console.log(`Seed user: ${JSON.stringify(doc1.toObject())}`);

    const doc2 = new this.userModel();
    Object.assign(doc2, data[1]);
    console.log(`Seed user: ${JSON.stringify(doc2.toObject())}`);

    this.promises.push(this.userModel.insertMany([doc1, doc2]));
  }

  seedPermission() {
    const data = [
      {
        _id: new Types.ObjectId(),
        ability: 'CREATE',
        resource: 'TASK',
        userId: this.idList[0].toString(),
      },
      {
        _id: new Types.ObjectId(),
        ability: 'READ',
        resource: 'TASK',
        userId: this.idList[0].toString(),
      },
      {
        _id: new Types.ObjectId(),
        ability: 'UPDATE',
        resource: 'TASK',
        userId: this.idList[0].toString(),
      },
      {
        _id: new Types.ObjectId(),
        ability: 'DELETE',
        resource: 'TASK',
        userId: this.idList[0].toString(),
      },
    ];

    const docs: PermissionDocumentInterface[] = [];
    data.map((d) => {
      const doc = new this.permissionModel();
      Object.assign(doc, d);
      console.log(`Seed permission: ${JSON.stringify(doc.toObject())}`);
      docs.push(doc);
    });

    this.promises.push(this.permissionModel.insertMany(docs));
  }

  @Command({
    command: 'db:seed',
    describe: 'Seed database',
  })
  async create() {
    let salt = await Bcrypt.genSalt(16);
    let pass = await Bcrypt.hash('password', salt);
    this.saltList.push(salt);
    this.passwordList.push(pass);
    salt = await Bcrypt.genSalt(16);
    pass = await Bcrypt.hash('password', salt);
    this.saltList.push(salt);
    this.passwordList.push(pass);

    this.seedUsers();
    this.seedPermission();

    Promise.all(this.promises)
      .then(() => console.log('The end'))
      .catch((e) => console.log(e));
  }
}
