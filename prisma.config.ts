import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const configuredDatabaseUrl = process.env.VANEANDO_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
// `prisma generate` debe poder ejecutarse durante el despliegue aunque Hostinger
// conserve temporalmente una DATABASE_URL antigua. Las consultas reales siguen
// usando la variable de entorno en src/lib/prisma.ts y /api/health informa del fallo.
const databaseUrl = /^mysql:\/\//i.test(configuredDatabaseUrl)
  ? configuredDatabaseUrl
  : 'mysql://invalid:invalid@127.0.0.1:3306/vaneando_missing_configuration';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
