import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const rawUrl = process.env.VANEANDO_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
const normalizedUrl = rawUrl
  ? rawUrl.replace(/^mariadb:\/\//i, 'mysql://')
  : 'mysql://build_user:build_pass@127.0.0.1:3306/gtrcars_build';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: normalizedUrl,
  },
});

