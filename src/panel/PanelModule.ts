import { Module } from '@nestjs/common';

import { PanelCommand } from '@x-spacy/balenciaga/panel/commands/PanelCommand';

@Module({
  providers: [
    PanelCommand
  ]
})
export class PanelModule {}
