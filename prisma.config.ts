import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const rawUrl = process.env.VANEANDO_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
const normalizedUrl = rawUrl.replace(/^mariadb:\/\//i, 'mysql://');

const databaseUrl = /^mysql:\/\//i.test(normalizedUrl)
  ? normalizedUrl
  : 'mysql://u896809627_vaneando:Sillaman1537912537912@127.0.0.1:3306/u896809627_vaneando';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
