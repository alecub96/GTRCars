import { prisma } from './prisma';

let schemaEnsured = false;

export async function ensureDbSchema() {
  if (schemaEnsured) return;
  try {
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS SupportConversation (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        userId VARCHAR(191) NOT NULL UNIQUE,
        status VARCHAR(191) NOT NULL DEFAULT 'OPEN',
        closedAt DATETIME(3) NULL,
        userSummarySentAt DATETIME(3) NULL,
        adminSummarySentAt DATETIME(3) NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS SupportMessage (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        conversationId VARCHAR(191) NOT NULL,
        senderId VARCHAR(191) NULL,
        system BOOLEAN NOT NULL DEFAULT FALSE,
        content TEXT NOT NULL,
        \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX idx_support_msg_conv_created (conversationId, createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    ];

    for (const tq of tableQueries) {
      await prisma.$executeRawUnsafe(tq).catch(() => {});
    }

    const alterQueries = [
      `ALTER TABLE Vehicle ADD COLUMN vehicleType VARCHAR(191) NOT NULL DEFAULT 'CAMPER'`,
      `ALTER TABLE User ADD COLUMN iban VARCHAR(191) NULL`,
      `ALTER TABLE User ADD COLUMN bankHolder VARCHAR(191) NULL`,
    ];

    for (const q of alterQueries) {
      await prisma.$executeRawUnsafe(q).catch(() => {});
    }
    schemaEnsured = true;
  } catch (err) {
    console.warn('Auto schema migration warning:', err);
  }
}
