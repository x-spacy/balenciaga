import { Inject, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { permissionsTable } from '@x-spacy/drizzle/schema';
import {
  and,
  eq,
  isNull
} from 'drizzle-orm';
import type { BunSQLDatabase } from 'drizzle-orm/bun-sql';

import { Permission } from '@x-spacy/balenciaga/permissions/schemas/Permission';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

@Injectable()
export class UserHasPermissionService {
  @Inject('Drizzle')
  private readonly drizzle: BunSQLDatabase;

  public async execute(userId: number, name: PermissionEnum) {
    const [ resultRow ] = await this.drizzle.select({
      id: permissionsTable.id,
      userId: permissionsTable.userId,
      name: permissionsTable.name,
      createdAt: permissionsTable.createdAt,
      updatedAt: permissionsTable.updatedAt
    }).from(permissionsTable).where(and(
      eq(permissionsTable.userId, userId),
      eq(permissionsTable.name, name),
      isNull(permissionsTable.deletedAt)
    )).limit(1);

    return plainToInstance(Permission, resultRow);
  }
}
