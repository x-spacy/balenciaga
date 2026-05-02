import { Injectable } from '@nestjs/common';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import { Message } from 'discord.js';

@Injectable()
export class TopPointsCommand extends AbstractCommand {
  constructor() {
    super('top');
  }

  public execute(message: Message) {
    //
  }
}
