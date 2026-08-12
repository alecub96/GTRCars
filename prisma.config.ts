import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.VANEANDO_DATABASE_URL?.trim();
if (!databaseUrl) throw new Error('VANEANDO_DATABASE_URL no está configurada');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
