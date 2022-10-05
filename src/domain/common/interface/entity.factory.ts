import { Document } from 'mongoose';
import Entity from '../../common/entity';

export default interface EntityFactory<D extends Document, E extends Entity> {
  createFromObject(data: object): E | null;
  createFromDocument(document: D): E | null;
}
