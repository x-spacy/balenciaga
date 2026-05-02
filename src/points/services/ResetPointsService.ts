import { Inject, Injectable } from '@nestjs/common';

import { userPointsTable } from '@x-spacy/drizzle/schema';
import { BunSQLDatabase } from 'drizzle-orm/bun-sql';

@Injectable()
export class ResetPointsService {
  @Inject('Drizzle')
  private readonly drizzle: BunSQLDatabase;

  public async execute() {
    await this.drizzle.update(userPointsTable).set({
      expiresAt: new Date()
    });
  }
}
