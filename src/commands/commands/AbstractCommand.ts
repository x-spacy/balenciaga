import { Message } from 'discord.js';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

export abstract class AbstractCommand {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getAliases() {
    return new Array<string>();
  }

  public getPermission(): PermissionEnum | null {
    return null;
  }

  public abstract execute(message: Message): void | Promise<void>;
}
