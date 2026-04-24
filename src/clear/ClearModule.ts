import { Module } from '@nestjs/common';

import { ClearCommand } from '@x-spacy/balenciaga/clear/commands/ClearCommand';

@Module({
  providers: [
    ClearCommand
  ]
})
export class ClearModule {}
