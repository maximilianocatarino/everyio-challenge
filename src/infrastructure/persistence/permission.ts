import { Document, model, Schema, Types } from 'mongoose';

export const permissionSchema: Schema = new Schema({
  _id: { type: Types.ObjectId, required: false },
  ability: { type: String, required: true },
  resource: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true },
});

export interface PermissionDocumentInterface extends Document {
  _id?: Types.ObjectId;
  ability: string;
  resource: string;
  userId: Types.ObjectId;
}

export default model<PermissionDocumentInterface>(
  'Permissions',
  permissionSchema,
);
