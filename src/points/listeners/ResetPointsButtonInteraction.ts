import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  ButtonInteraction,
  EmbedBuilder,
  MessageFlags
} from 'discord.js';

import { ResetPointsService } from '@x-spacy/balenciaga/points/services/ResetPointsService';

@Injectable()
export class ResetPointsButtonInteraction {
  @Inject('ResetPointsService')
  private readonly resetPointsService: ResetPointsService;

  @OnEvent('ResetPointsCommand.ButtonInteraction')
  public async onResetPointsButtonInteraction(interaction: ButtonInteraction) {
    console.log(interaction.customId);

    switch (interaction.customId) {
      case 'RESET_POINTS:RESET': {
        await this.resetPointsService.execute();

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Pontos resetados')
              .setDescription('Os pontos de todos os usuários foram resetados.')
              .setColor('#EB4C60')
          ],
          flags: [
            MessageFlags.Ephemeral
          ]
        });

        break;
      }

      case 'RESET_POINTS:CANCEL': {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Operação cancelada')
              .setDescription('A operação de reset de pontos foi cancelada.')
              .setColor('#EB4C60')
          ],
          flags: [
            MessageFlags.Ephemeral
          ]
        });

        break;
      }
    }

    return interaction.deferUpdate();
  }
}
