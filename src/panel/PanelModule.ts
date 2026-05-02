import { Module } from '@nestjs/common';

import { PanelCommand } from '@x-spacy/balenciaga/panel/commands/PanelCommand';
import { UserSelectMenuInteractionListener } from '@x-spacy/balenciaga/panel/listeners/UserSelectMenuInteraction';

@Module({
  providers: [
    /**
     * Commands
     */
    PanelCommand,
    /**
     * Listeners
     */
    UserSelectMenuInteractionListener
  ]
})
export class PanelModule {}
