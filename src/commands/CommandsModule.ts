import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { HelpCommand } from '@x-spacy/balenciaga/commands/commands/HelpCommand';
import { MessageCreatedListener } from '@x-spacy/balenciaga/commands/listeners/MessageCreatedListener';
import { PermissionsModule } from '@x-spacy/balenciaga/permissions/PermissionsModule';
import { SettingsModule } from '@x-spacy/balenciaga/settings/SettingsModule';

@Module({
  imports: [
    DiscoveryModule,
    SettingsModule,
    PermissionsModule
  ],
  providers: [
    HelpCommand,
    /**
     * Listeners
     */
    MessageCreatedListener
  ]
})
export class CommandsModule {}
