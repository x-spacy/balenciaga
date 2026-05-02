import { Inject, Injectable } from '@nestjs/common';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import { Message, TextChannel } from 'discord.js';

import { AddPointToUserService } from '@x-spacy/balenciaga/points/services/AddPointToUserService';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

@Injectable()
export class AddPointCommand extends AbstractCommand {
  @Inject('AddPointToUserService')
  private readonly addPointToUserService: AddPointToUserService;

  constructor() {
    super('add');
  }

  public getPermission(): PermissionEnum | null {
    return PermissionEnum.MANAGE_POINTS;
  }

  public async execute(message: Message) {
    const textChannel = message.channel as TextChannel;

    const args = message.content.split(' ');

    if (args.length !== 3) {
      textChannel.sendTemporaryMessage('Você precisa mencionar um usuário e a quantidade de pontos.');

      return;
    }

    const mentionedUser = message.mentions.users.first();

    if (!mentionedUser) {
      textChannel.sendTemporaryMessage('Você precisa mencionar um usuário para adicionar pontos.');

      return;
    }

    const points = parseInt(args[2]);

    if (isNaN(points) || points <= 0) {
      textChannel.sendTemporaryMessage('Você precisa informar uma quantidade de pontos válida.');

      return;
    }

    await this.addPointToUserService.execute(mentionedUser, points);

    await textChannel.sendTemporaryMessage(`Você adicionou **${points}** pontos para <@${mentionedUser.id}>.`);
  }
}
