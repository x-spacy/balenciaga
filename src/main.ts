import 'reflect-metadata';

import { Response } from 'express';

import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import {
  ArgumentsHost,
  BadRequestException,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Logger,
  Module,
  ValidationPipe,
  VersioningType
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NestExpressApplication } from '@nestjs/platform-express';

import KeyvRedis from '@keyv/redis';
import { HealthzModule } from '@x-spacy/nest-template/healthz/HealthzModule';
import {
  I18nModule,
  I18nService,
  QueryResolver
} from 'nestjs-i18n';

import { DatabaseModule } from '@x-spacy/nest-template/database/DatabaseModule';

import { Environment } from '@x-spacy/environment';

@Module({
  imports: [
    HealthzModule,
    DatabaseModule.forRoot(),
    EventEmitterModule.forRoot(),
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
          ttl: 15_000,
          nonBlocking: true,
          stores: [
            new KeyvRedis({
              url: `redis://${Environment.getString('REDIS_USERNAME')}:${Environment.getString('REDIS_PASSWORD')}@${Environment.getString('REDIS_HOST')}:${Environment.getInt('REDIS_PORT')}/${Environment.getInt('REDIS_DATABASE')}`
            })
          ]
        };
      }
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'pt-br',
      throwOnMissingKey: true,
      logging: true,
      loaderOptions: {
        path: `${Environment.workingDirectory}/i18n`,
        includeSubfolders: true,
        filePattern: '*.json',
        watch: true
      },
      resolvers: [
        QueryResolver
      ]
    })
  ]
})
class Application {
  public static async main() {
    const application = await NestFactory.create<NestExpressApplication>(Application, {
      cors: {
        origin: true,
        credentials: true
      }
    });

    application.enableVersioning({
      type: VersioningType.URI
    });

    application.useGlobalInterceptors(new ClassSerializerInterceptor(application.get(Reflector)));

    application.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        Logger.error(errors);

        return new BadRequestException({
          message: errors
        });
      },
      transformOptions: {
        enableImplicitConversion: true
      }
    }));

    application.useGlobalFilters({
      catch: (error: Error, host: ArgumentsHost) => {
        const response = host.switchToHttp().getResponse<Response>();

        const i18n = application.get<I18nService>(I18nService);

        Logger.error(error.message, error.stack, error.name);

        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = i18n.t(`error.${error.name}`);

        if (error instanceof TypeError) {
          message = error.message;
        }

        return response.status(status).json({
          message
        });
      }
    });

    application.listen(Environment.getInt('PORT'), () => {
      Logger.log(`http server is listening on port ${Environment.getInt('PORT')}`, Application.name);
    });
  }
}

Application.main();
