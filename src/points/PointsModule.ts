import { Module } from '@nestjs/common';

import { AddPointCommand } from '@x-spacy/balenciaga/points/commands/AddPointCommand';
import { ResetPointsCommand } from '@x-spacy/balenciaga/points/commands/ResetPointsCommand';
import { ResetPointsButtonInteraction } from '@x-spacy/balenciaga/points/listeners/ResetPointsButtonInteraction';

import { AddPointToUserService } from '@x-spacy/balenciaga/points/services/AddPointToUserService';
import { ResetPointsService } from '@x-spacy/balenciaga/points/services/ResetPointsService';

@Module({
  providers: [
    /**
     * Commands
     */
    AddPointCommand,
    ResetPointsCommand,
    /**
     * Services
     */
    {
      provide: 'AddPointToUserService',
      useClass: AddPointToUserService
    },
    {
      provide: 'ResetPointsService',
      useClass: ResetPointsService
    },
    /**
     * Listeners
     */
    ResetPointsButtonInteraction
  ]
})
export class PointsModule {}
