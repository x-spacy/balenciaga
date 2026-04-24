import { DynamicModule } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Client,
  Events,
  GatewayIntentBits
} from 'discord.js';

import { Environment } from '@x-spacy/environment';

export class DiscordModule {
  public static forRoot(): DynamicModule {
    return {
      module: DiscordModule,
      providers: [
        {
          provide: 'DiscordClient',
          useFactory: async (eventEmitter: EventEmitter2) => {
            const client = new Client({
              intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildExpressions
              ]
            });

            client.on(Events.MessageCreate, event => {
              eventEmitter.emit(Events.MessageCreate, event);
            });

            client.on(Events.ClientReady, event => {
              eventEmitter.emit(Events.ClientReady, event);
            });

            client.on(Events.GuildMemberUpdate, event => {
              eventEmitter.emit(Events.GuildMemberUpdate, event);
            });

            client.on(Events.GuildMemberRemove, event => {
              eventEmitter.emit(Events.GuildMemberRemove, event);
            });

            client.on(Events.GuildBanAdd, event => {
              eventEmitter.emit(Events.GuildMemberRemove, event);
            });

            client.on(Events.MessageReactionAdd, event => {
              eventEmitter.emit(Events.MessageReactionAdd, event);
            });

            client.on(Events.MessageReactionRemove, event => {
              eventEmitter.emit(Events.MessageReactionRemove, event);
            });

            client.on(Events.MessageReactionRemoveAll, event => {
              eventEmitter.emit(Events.MessageReactionRemoveAll, event);
            });

            return client.login(Environment.getString('DISCORD_ACCESS_TOKEN')).then(() => client);
          },
          inject: [
            EventEmitter2
          ]
        }
      ],
      exports: [
        'DiscordClient'
      ]
    };
  }
}
