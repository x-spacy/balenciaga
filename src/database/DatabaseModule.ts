import { DynamicModule } from '@nestjs/common';

import { drizzle } from 'drizzle-orm/bun-sql';

import { Environment } from '@x-spacy/environment';

export class DatabaseModule {
  public static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      providers: [
        {
          provide: 'Drizzle',
          useFactory: async () => {
            return drizzle({
              logger: Environment.getString('NODE_ENV') === 'development',
              connection: {
                host: Environment.getString('DATABASE_HOST'),
                port: Environment.getInt('DATABASE_PORT'),
                user: Environment.getString('DATABASE_USERNAME'),
                password: Environment.getString('DATABASE_PASSWORD'),
                database: Environment.getString('DATABASE_NAME')
              }
            });
          }
        }
      ],
      exports: [
        'Drizzle'
      ]
    };
  }
}
