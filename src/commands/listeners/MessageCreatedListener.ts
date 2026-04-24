import { Inject, Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import { Events, Message } from 'discord.js';

import { UserHasPermissionService } from '@x-spacy/balenciaga/permissions/services/UserHasPermissionService';

import { SettingsCache } from '@x-spacy/balenciaga/settings/cache/SettingsCache';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';
import { SettingsEnum } from '@x-spacy/balenciaga/settings/enums/SettingsEnum';

@Injectable()
export class MessageCreatedListener {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  @Inject('SettingsCache')
  private readonly settingsCache: SettingsCache;

  @Inject('UserHasPermissionService')
  private readonly userHasPermissionService: UserHasPermissionService;

  @OnEvent(Events.MessageCreate)
  public async on(message: Message) {
    const channel = message.channel;

    if (!channel.isTextBased()) {
      return;
    }

    const messageContent = message.content;

    const settings = await this.settingsCache.get(SettingsEnum.COMMAND_PREFIX);

    if (!messageContent.toLowerCase().startsWith(settings.value)) {
      return;
    }

    const commandName = (messageContent.includes(' ') ? messageContent.split(' ')[0] : messageContent).toLowerCase();
    const args = messageContent.includes(' ') ? messageContent.split(' ').slice(1) : [];

    this.eventEmitter.emit('CommandExecute', commandName, args, message);

    const command = this.discoveryService
      .getProviders()
      .filter(({ instance }) => instance instanceof AbstractCommand)
      .map(({ instance }) => instance as AbstractCommand)
      .find((command) => {
        const commandAliasOrName = commandName.split(settings.value)[1];

        if (command.name === commandAliasOrName || command.getAliases().includes(commandAliasOrName)) {
          return command;
        }

        return null;
      });

    if (!command) {
      return message.reply({
        content: `Comando \`'${commandName}'\` desconhecido.`
      }).then(unknownCommandMessage => setTimeout(() => unknownCommandMessage.delete(), 5_000));
    }

    const hasPermission = await this.checkIfUserHasPermission(Number(message.author.id), command.getPermission());

    if (!hasPermission) {
      return message.reply({
        content: 'Você não tem permissão para executar este comando.'
      }).then(permissionDeniedMessage => setTimeout(() => permissionDeniedMessage.delete(), 5_000));
    }

    return command.execute(message);
  }

  private async checkIfUserHasPermission(userId: number, permissionName: PermissionEnum | null) {
    if (!permissionName) {
      return true;
    }

    const userHasPermission = await this.userHasPermissionService.execute(userId, permissionName);

    if (userHasPermission) {
      return true;
    }

    return false;
  }
}
