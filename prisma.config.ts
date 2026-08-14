import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const configuredDatabaseUrl = process.env.DATABASE_URL?.trim() || '';
const databaseUrl = /^(mysql|mariadb):\/\//i.test(configuredDatabaseUrl)
  ? configuredDatabaseUrl
  : 'mysql://invalid:invalid@127.0.0.1:3306/vaneando_missing_configuration';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
