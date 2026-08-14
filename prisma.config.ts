import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const configuredDatabaseUrl = process.env.DATABASE_URL?.trim() || '';
const databaseUrl = /^(postgresql|postgres):\/\//i.test(configuredDatabaseUrl)
  ? configuredDatabaseUrl
  : 'postgresql://invalid:invalid@127.0.0.1:5432/vaneando_missing_configuration';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
