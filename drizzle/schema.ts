import {
  bigint,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

import { PermissionEnum } from '@x-spacy/balenciaga/permissions/enums/PermissionEnum';

export const rolesTable = pgTable('roles', {
  id: bigint('id', { mode: 'number' }).notNull().primaryKey(),
  name: varchar('name', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: false
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: false
  }).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', {
    withTimezone: false
  })
});

export const settingsTable = pgTable('settings', {
  name: text('name').notNull().primaryKey(),
  value: text('value').notNull()
});

export const permissionNameEnum = pgEnum('permission_names_enum', PermissionEnum);

export const permissionsTable = pgTable('permissions', {
  id: serial('id').notNull().primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  name: permissionNameEnum('name').notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: false
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: false
  }).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', {
    withTimezone: false
  })
});

export const userRolesTable = pgTable('user_roles', {
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  roleId: bigint('role_id', { mode: 'number' }).notNull().references(() => rolesTable.id, {
    onUpdate: 'cascade',
    onDelete: 'restrict'
  }),
  createdAt: timestamp('created_at', {
    withTimezone: false
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: false
  }).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', {
    withTimezone: false
  })
});

export const userPointsTable = pgTable('user_points', {
  id: serial('id').notNull().primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  points: integer('points').notNull().default(0),
  expiresAt: timestamp('expires_at', {
    withTimezone: false
  }),
  createdAt: timestamp('created_at', {
    withTimezone: false
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: false
  }).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', {
    withTimezone: false
  })
});
