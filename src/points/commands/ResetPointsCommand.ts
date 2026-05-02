import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  MessageFlags,
  TextChannel
} from 'discord.js';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

@Injectable()
export class ResetPointsCommand extends AbstractCommand {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  constructor() {
    super('reset');
  }

  public getPermission() {
    return PermissionEnum.MANAGE_POINTS;
  }

  public execute(message: Message) {
    const author = message.author;
    const textChannel = message.channel as TextChannel;

    textChannel.sendTemporaryMessage({
      embeds: [
        new EmbedBuilder()
          .setTitle('Resetar Pontos')
          .setDescription(`
            Você deseja mesmo resetar os pontos de todos os usuários?
          `)
          .setColor('#EB4C60')
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('RESET_POINTS:RESET')
              .setLabel('Resetar')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('RESET_POINTS:CANCEL')
              .setLabel('Cancelar')
              .setStyle(ButtonStyle.Secondary)
          )
      ]
    }, 15_000).then(message => {
      const collector = message.createMessageComponentCollector();

      collector.on('collect', async interaction => {
        if (!interaction.isButton()) {
          return interaction.deferUpdate();
        }

        if (interaction.user.id !== author.id) {
          return interaction.reply({
            content: 'Você não tem permissão para realizar essa ação.',
            flags: [
              MessageFlags.Ephemeral
            ]
          });
        }

        this.eventEmitter.emit('ResetPointsCommand.ButtonInteraction', interaction);
      });
    });
  }
}
