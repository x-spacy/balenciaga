import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { User, UserSelectMenuInteraction } from 'discord.js';

@Injectable()
export class UserSelectMenuInteractionListener {
  @OnEvent('PanelCommand.UserSelectMenuInteraction.ADD_PD')
  public async onAddPD(author: User, interaction: UserSelectMenuInteraction) {
    const user = interaction.users.first();

    if (!user) {
      return interaction.replyTemporaryMessage('Você não selecionou ninguém.');
    }

    if (user.id === author.id) {
      return interaction.replyTemporaryMessage('Você não pode adicionar a si mesmo.');
    }

    if (user.bot) {
      return interaction.replyTemporaryMessage('Você não pode adicionar um bot.');
    }

    console.log('add pd to user', user.id);
  }

  @OnEvent('PanelCommand.UserSelectMenuInteraction.REMOVE_PD')
  public async onRemovePD(author: User, interaction: UserSelectMenuInteraction) {
    const user = interaction.users.first();

    if (!user) {
      return interaction.replyTemporaryMessage('Você não selecionou ninguém.');
    }

    if (user.id === author.id) {
      return interaction.replyTemporaryMessage('Você não pode adicionar a si mesmo.');
    }

    if (user.bot) {
      return interaction.replyTemporaryMessage('Você não pode adicionar um bot.');
    }

    console.log('remove pd from user', user.id);
  }
}
