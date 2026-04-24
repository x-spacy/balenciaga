import { Inject, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { settingsTable } from '@x-spacy/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { BunSQLDatabase } from 'drizzle-orm/bun-sql';

import { Settings } from '@x-spacy/balenciaga/settings/schemas/Settings';

@Injectable()
export class FindSettingsByNameService {
  @Inject('Drizzle')
  private readonly drizzle: BunSQLDatabase;

  public async execute(name: string) {
    const [ resultRow ] = await this.drizzle.select({
      name: settingsTable.name,
      value: settingsTable.value
    }).from(settingsTable).where(eq(settingsTable.name, name)).limit(1);

    return plainToInstance(Settings, resultRow);
  }
}
