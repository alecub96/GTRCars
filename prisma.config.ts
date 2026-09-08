import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const rawUrl = process.env.VANEANDO_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
const normalizedUrl = rawUrl.replace(/^mariadb:\/\//i, 'mysql://');

if (!/^mysql:\/\//i.test(normalizedUrl)) {
  throw new Error('VANEANDO_DATABASE_URL o DATABASE_URL debe estar configurada con una URL mysql:// válida');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: normalizedUrl,
  },
});
