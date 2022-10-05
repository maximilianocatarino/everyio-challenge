export interface EntityData {
  id?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface EntityInterface {
  getId(): string;
  setId(id: string): void;

  getEntityName(): string;

  getCreatedAt(): Date;
  setCreatedAt(date: Date): void;
  getUpdatedAt(): Date;
  setUpdatedAt(date: Date): void;
  getDeletedAt(): Date;
  setDeletedAt(date: Date): void;

  toObject(): object;
  serialize(): object;
}

export default abstract class Entity implements EntityInterface {
  protected id: string;
  static entityName: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected deletedAt: Date;

  constructor() {
    this.createdAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  setId(value: string) {
    this.id = value;
  }

  getEntityName(): string {
    return Entity.entityName;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setCreatedAt(date: Date): void {
    this.createdAt = date;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  getDeletedAt(): Date {
    return this.deletedAt;
  }

  setDeletedAt(date: Date): void {
    this.deletedAt = date;
  }

  abstract toObject(): object;

  abstract serialize(): object;
}
