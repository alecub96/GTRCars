import { prisma } from './prisma';

let schemaEnsured = false;

export async function ensureDbSchema() {
  if (schemaEnsured) return;
  try {
    const alterQueries = [
      `ALTER TABLE Vehicle ADD COLUMN vehicleType VARCHAR(191) NOT NULL DEFAULT 'CAMPER'`,
      `ALTER TABLE User ADD COLUMN iban VARCHAR(191) NULL`,
      `ALTER TABLE User ADD COLUMN bankHolder VARCHAR(191) NULL`,
    ];

    for (const q of alterQueries) {
      await prisma.$executeRawUnsafe(q).catch((err) => {
        // Ignorar si la columna ya existe en MariaDB
      });
    }
    schemaEnsured = true;
  } catch (err) {
    console.warn('Auto schema migration warning:', err);
  }
}
