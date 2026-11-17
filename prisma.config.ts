import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import * as fs from 'fs';
import * as path from 'path';

// Cargar .env.local si existe
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const connectionUrl =
  process.env.DIRECT_URL?.trim() ||
  process.env.GTRCARS_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  '';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: connectionUrl,
  },
});
