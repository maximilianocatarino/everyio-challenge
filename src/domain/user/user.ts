import Entity, { EntityData, EntityInterface } from '../common/entity';

export interface UserData extends EntityData {
  id?: string;
  name: string;
  email: string;
  username: string;
  salt?: string;
  password?: string;
}

export interface UserInterface extends EntityInterface {
  getId(): string;
  setId(id: string): void;

  getName(): string;
  setName(name: string): void;

  getEmail(): string;
  setEmail(email: string): void;

  getUsername(): string;
  setUsername(username: string): void;

  getPassword(): string;
  setPassword(password: string): void;

  getSalt(): string;
  setSalt(salt: string): void;

  toObject(): object;
}

export default class User extends Entity implements UserInterface {
  protected id: string;
  protected name: string;
  protected email: string;
  protected username: string;
  protected password: string;
  protected salt: string;

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  getPassword(): string {
    return this.email;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  getSalt(): string {
    return this.email;
  }

  setSalt(salt: string): void {
    this.salt = salt;
  }

  toObject(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      createdAt: this.createdAt,
    };
  }

  serialize(): object {
    return this.toObject();
  }
}
