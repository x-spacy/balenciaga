import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { AbstractCommand } from '@x-spacy/balenciaga/commands/commands/AbstractCommand';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  Message,
  TextChannel,
  User
} from 'discord.js';

@Injectable()
export class PanelCommand extends AbstractCommand {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  constructor() {
    super('painel');
  }

  public async execute(message: Message) {
    const textChannel = message.channel as TextChannel;
    const author = message.author;

    const embedBuilder = new EmbedBuilder()
      .setTitle('Painel Grife')
      .setFooter({
        text: author.globalName ?? author.displayName,
        iconURL: author.avatarURL()!
      })
      .setTimestamp(Date.now())
      .setDescription(`
        Bem-vindo(a), <@${author.id}>!
        
        Esse é o painel mais estiloso que você já viu.
        Use os botões abaixo para gerenciar os capa de revista que você conhece.
        
        ** ・ PD**: Nenhum atribuído
        ** ・ CL**: Nenhum atribuído
        ** ・ ANTIBAN**: Nenhum atribuído
        ** ・ ELITE**: Nenhum atribuído
      `)
      .setColor('#EB4C60');

    const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ADD_PD')
          .setLabel('Adicionar PD')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ADD_CL')
          .setLabel('Adicionar CL')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ADD_ANTIBAN')
          .setLabel('Adicionar ANTIBAN')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ADD_ELITE')
          .setLabel('Adicionar ELITE')
          .setStyle(ButtonStyle.Secondary)
      );

    textChannel.send({
      embeds: [
        embedBuilder
      ],
      components: [
        actionRowBuilder
      ]
    }).then(message => {
      const collector = message.createMessageComponentCollector();

      collector.on('collect', async interaction => {
        if (!interaction.isButton()) {
          return;
        }

        this.eventEmitter.emit('PanelCommand.Interaction', textChannel, author, interaction);
      });
    });
  }

  @OnEvent('PanelCommand.Interaction')
  public async onInteraction(textChannel: TextChannel, author: User, interaction: ButtonInteraction) {
    const interactedUser = interaction.user;

    if (interactedUser.id !== author.id) {
      return;
    }

    switch (interaction.customId) {
      case 'ADD_PD': {
        await textChannel.send('Adicionar PD...');

        break;
      }
      case 'ADD_CL': {
        await textChannel.send('Adicionar CL...');

        break;
      }
      case 'ADD_ANTIBAN': {
        await textChannel.send('Adicionar Antiban...');

        break;
      }
      case 'ADD_ELITE': {
        await textChannel.send('Adicionar Elite...');

        break;
      }
    }

    await interaction.deferUpdate();
  }
}
