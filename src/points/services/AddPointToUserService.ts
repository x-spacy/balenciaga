import { Inject, Injectable } from '@nestjs/common';

import { userPointsTable } from '@x-spacy/drizzle/schema';
import { User } from 'discord.js';
import type { BunSQLDatabase } from 'drizzle-orm/bun-sql';

@Injectable()
export class AddPointToUserService {
  @Inject('Drizzle')
  private readonly drizzle: BunSQLDatabase;

  public async execute(user: User, quantity: number) {
    const today = new Date();

    const lastDayOfWeek = today.getDate() - (today.getDay() + 1);

    await this.drizzle.insert(userPointsTable).values({
      userId: Number(user.id),
      points: quantity,
      expiresAt: new Date(today.setDate(lastDayOfWeek))
    });
  }
}
