import { Document, model, Schema, Types } from 'mongoose';

export const userSchema: Schema = new Schema(
  {
    _id: { type: Types.ObjectId, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export interface UserDocumentInterface extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  username: string;
  salt?: string;
  password?: string;
  createdAt: Date;
  updateddAt?: Date;
}

export default model<UserDocumentInterface>('Users', userSchema);
