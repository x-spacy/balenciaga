import type { Config } from 'drizzle-kit';
import 'tsconfig-paths/register';

import { Environment } from '@x-spacy/environment';

export default {
  dialect: 'postgresql',
  schema: './src/**/schemas/*.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: {
    host: Environment.getString('DATABASE_HOST'),
    port: Environment.getInt('DATABASE_PORT'),
    user: Environment.getString('DATABASE_USERNAME'),
    password: Environment.getString('DATABASE_PASSWORD'),
    database: Environment.getString('DATABASE_NAME'),
    ssl: false
  }
} satisfies Config;
