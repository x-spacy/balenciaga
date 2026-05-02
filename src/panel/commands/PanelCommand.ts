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
  User,
  UserSelectMenuBuilder
} from 'discord.js';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

@Injectable()
export class PanelCommand extends AbstractCommand {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  constructor() {
    super('painel');
  }

  public getPermission() {
    return PermissionEnum.OPEN_PANEL;
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

    textChannel.sendTemporaryMessage({
      embeds: [
        embedBuilder
      ],
      components: [
        actionRowBuilder
      ]
    }, 15_000).then(message => {
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
        textChannel.sendTemporaryMessage({
          embeds: [
            new EmbedBuilder()
              .setTitle('Adicionar PD :emoji_67:')
              .setDescription(`
                Quem você deseja adicionar?

                Selecione o usuário que você deseja adicionar o PD.
              `)
              .setColor('#EB4C60')
          ],
          components: [
            new ActionRowBuilder<UserSelectMenuBuilder>()
              .addComponents(new UserSelectMenuBuilder()
                .setCustomId('ADD_PD')
                .setPlaceholder('Selecione o usuário que você deseja adicionar o PD.')
                .setMinValues(1)
                .setMaxValues(1))
          ]
        }, 15_000).then(message => {
          const collector = message.createMessageComponentCollector();

          collector.on('collect', async interaction => {
            if (!interaction.isUserSelectMenu()) {
              return;
            }

            this.eventEmitter.emit('PanelCommand.UserSelectMenuInteraction.ADD_PD', author, interaction);

            return interaction.deferUpdate();
          });
        });

        break;
      }
      case 'ADD_CL': {
        textChannel.sendTemporaryMessage({
          embeds: [
            new EmbedBuilder()
              .setTitle('Adicionar CL :emoji_67:')
              .setDescription(`
                Quem você deseja adicionar?

                Selecione o usuário que você deseja adicionar o CL.
              `)
              .setColor('#EB4C60')
          ],
          components: [
            new ActionRowBuilder<UserSelectMenuBuilder>()
              .addComponents(new UserSelectMenuBuilder()
                .setCustomId('ADD_CL')
                .setPlaceholder('Selecione o usuário que você deseja adicionar o CL.')
                .setMinValues(1)
                .setMaxValues(1))
          ]
        }, 15_000).then(message => {
          const collector = message.createMessageComponentCollector();

          collector.on('collect', async interaction => {
            if (!interaction.isUserSelectMenu()) {
              return;
            }

            this.eventEmitter.emit('PanelCommand.UserSelectMenuInteraction.ADD_CL', author, interaction);

            return interaction.deferUpdate();
          });
        });

        break;
      }
      case 'ADD_ANTIBAN': {
        textChannel.sendTemporaryMessage({
          embeds: [
            new EmbedBuilder()
              .setTitle('Adicionar ANTIBAN :emoji_67:')
              .setDescription(`
                Quem você deseja adicionar?

                Selecione o usuário que você deseja adicionar o ANTIBAN.
              `)
              .setColor('#EB4C60')
          ],
          components: [
            new ActionRowBuilder<UserSelectMenuBuilder>()
              .addComponents(new UserSelectMenuBuilder()
                .setCustomId('ADD_ANTIBAN')
                .setPlaceholder('Selecione o usuário que você deseja adicionar o ANTIBAN.')
                .setMinValues(1)
                .setMaxValues(1))
          ]
        }, 15_000).then(message => {
          const collector = message.createMessageComponentCollector();

          collector.on('collect', async interaction => {
            if (!interaction.isUserSelectMenu()) {
              return;
            }

            this.eventEmitter.emit('PanelCommand.UserSelectMenuInteraction.ADD_ANTIBAN', author, interaction);

            return interaction.deferUpdate();
          });
        });

        break;
      }
      case 'ADD_ELITE': {
        textChannel.sendTemporaryMessage({
          embeds: [
            new EmbedBuilder()
              .setTitle('Adicionar ELITE :emoji_67:')
              .setDescription(`
                Quem você deseja adicionar?

                Selecione o usuário que você deseja adicionar o ELITE.
              `)
              .setColor('#EB4C60')
          ],
          components: [
            new ActionRowBuilder<UserSelectMenuBuilder>()
              .addComponents(new UserSelectMenuBuilder()
                .setCustomId('ADD_ELITE')
                .setPlaceholder('Selecione o usuário que você deseja adicionar o ELITE.')
                .setMinValues(1)
                .setMaxValues(1))
          ]
        }, 15_000).then(message => {
          const collector = message.createMessageComponentCollector();

          collector.on('collect', async interaction => {
            if (!interaction.isUserSelectMenu()) {
              return;
            }

            this.eventEmitter.emit('PanelCommand.UserSelectMenuInteraction.ADD_ELITE', author, interaction);

            return interaction.deferUpdate();
          });
        });

        break;
      }
    }

    await interaction.deferUpdate();
  }
}
