import { Injectable } from '@nestjs/common';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import type {
  FetchMessagesOptions,
  Message,
  TextChannel
} from 'discord.js';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

@Injectable()
export class ClearCommand extends AbstractCommand {
  constructor() {
    super('clear');
  }

  public getAliases() {
    return [ 'cl' ];
  }

  public getPermission() {
    return PermissionEnum.CLEAR_OWN_MESSAGES;
  }

  public async execute(message: Message) {
    const author = message.author;

    const textChannel = message.channel as TextChannel;

    const messagesToDelete = new Array<Message>();

    let lastId = null;

    while (true) {
      const options: FetchMessagesOptions = { limit: 100 };

      if (lastId) {
        options.before = lastId;
      }

      const messages = await textChannel.messages.fetch(options);

      if (messages.size === 0) {
        break;
      }

      lastId = messages.last()?.id;

      messages.filter((message) => message.author.id === author.id).forEach((message) => {
        messagesToDelete.push(message);
      });

      if (messages.size < 100) {
        break;
      }
    }

    await textChannel.bulkDelete(messagesToDelete, true).then(async () => textChannel.sendTemporaryMessage(`${messagesToDelete.length} Mensagens apagadas.`));
  }
}
