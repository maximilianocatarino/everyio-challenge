export interface PermissionInterface {
  getId(): string;
  setId(id: string): void;

  getAbility(): string;
  setAbility(ability: string): void;

  getResource(): string;
  setResource(resource: string): void;

  getUserId(): string;
  setUserId(userId: string): void;

  toObject(): object;
}

export default class User implements PermissionInterface {
  protected id: string;
  protected ability: string;
  protected resource: string;
  protected userId: string;

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getAbility(): string {
    return this.ability;
  }

  setAbility(ability: string): void {
    this.ability = ability;
  }

  getResource(): string {
    return this.resource;
  }

  setResource(resource: string): void {
    this.resource = resource;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  toObject(): object {
    return {
      id: this.id,
      ability: this.ability,
      resource: this.resource,
      usernId: this.userId,
    };
  }
}
