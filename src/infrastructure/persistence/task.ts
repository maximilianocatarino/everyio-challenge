import { Document, model, Schema, Types } from 'mongoose';
import { UserDocumentInterface } from './user';
import {
  taskStatusEnumValues,
  TaskStatusEnum,
} from '../../domain/task/task.status.enum';

export const userSchema: Schema = new Schema(
  {
    id: { type: Types.ObjectId, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const taskSchema: Schema = new Schema(
  {
    _id: { type: Types.ObjectId, required: false },
    user: new Schema(userSchema),
    title: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 777 },
    status: {
      type: Number,
      required: true,
      enum: taskStatusEnumValues,
      default: 1,
    },
  },
  { timestamps: true },
);

export interface TaskDocumentInterface extends Document {
  _id?: Types.ObjectId;
  user: UserDocumentInterface;
  title: string;
  description: string;
  status: TaskStatusEnum;
  createdAt: Date;
  updateddAt?: Date;
}

export default model<TaskDocumentInterface>('Task', taskSchema);
