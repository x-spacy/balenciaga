import 'reflect-metadata';

import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

import KeyvRedis from '@keyv/redis';
import { ClearModule } from '@x-spacy/balenciaga/clear/ClearModule';
import { CommandsModule } from '@x-spacy/balenciaga/commands/CommandsModule';
import { DiscordModule } from '@x-spacy/balenciaga/discord/DiscordModule';
import { PanelModule } from '@x-spacy/balenciaga/panel/PanelModule';
import { RolesModule } from '@x-spacy/balenciaga/roles/RolesModule';
import { DrizzleQueryError } from 'drizzle-orm';

import { DatabaseModule } from '@x-spacy/balenciaga/database/DatabaseModule';

import { Environment } from '@x-spacy/environment';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    EventEmitterModule.forRoot(),
    DiscordModule.forRoot(),
    RolesModule,
    CommandsModule,
    ClearModule,
    PanelModule,
    BullModule.forRoot({
      connection: {
        host: Environment.getString('REDIS_HOST'),
        port: Environment.getInt('REDIS_PORT'),
        username: Environment.getString('REDIS_USERNAME'),
        password: Environment.getString('REDIS_PASSWORD'),
        db: Environment.getInt('REDIS_DATABASE')
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
      }
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          ttl: 5_000,
          nonBlocking: true,
          stores: [
            new KeyvRedis({
              url: `redis://${Environment.getString('REDIS_USERNAME')}:${Environment.getString('REDIS_PASSWORD')}@${Environment.getString('REDIS_HOST')}:${Environment.getInt('REDIS_PORT')}/${Environment.getInt('REDIS_DATABASE')}`
            })
          ]
        };
      }
    })
  ]
})
class Application {
  public static async main() {
    const application = await NestFactory.create(Application);

    application.useGlobalFilters({
      catch: (error: Error) => {
        let message = error.message;

        if (error instanceof DrizzleQueryError) {
          message = error?.cause?.message ?? String(error.cause);
        }

        if (error instanceof TypeError) {
          message = error.message;
        }

        Logger.error(message, error.stack, error.name);
      }
    });

    await application.init();
  }
}

Application.main();
