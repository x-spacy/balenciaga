import { Injectable } from '@nestjs/common';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import { Message, TextChannel } from 'discord.js';

@Injectable()
export class HelpCommand extends AbstractCommand {
  constructor() {
    super('help');
  }

  public async execute(message: Message) {
    const channel = message.channel as TextChannel;

    channel.send('Hello, this is the help message');
  }
}
