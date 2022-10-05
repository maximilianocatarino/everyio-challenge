export interface Rule {
  isValid(): Promise<boolean>;
  getMessages(): string[];
}

export default class BaseValidator {
  protected rules: Map<string, Rule[]>;
  protected messages: string[] = [];

  constructor() {
    this.resetRules();
  }

  resetRules(): void {
    this.rules = new Map<string, Rule[]>();
    this.rules.set('default', []);
  }

  addRule(rule: Rule, context = 'default'): void {
    if (!this.rules.has(context)) {
      this.rules.set(context, []);
    }

    this.rules.get(context)?.push(rule);
  }

  async isValid(context = 'default'): Promise<boolean> {
    if (this.rules.has(context)) {
      if (this.rules.has(context)) {
        let isValid = true;
        this.messages = [];
        const collection: Rule[] = this.rules.get(context) ?? [];
        for (let i = 0; i < collection.length; i++) {
          isValid = isValid && (await collection[i].isValid());
          this.messages = this.messages.concat(collection[i].getMessages());
        }
        return Promise.resolve(isValid);
      }
    }
    return Promise.resolve(false);
  }

  getMessages(): string[] {
    return this.messages;
  }
}
