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

      `CREATE TABLE IF NOT EXISTS VehiclePhoto (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        vehicleId VARCHAR(191) NOT NULL,
        url TEXT NOT NULL,
        orderIndex INT NOT NULL DEFAULT 0,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX idx_veh_photo_order (vehicleId, orderIndex)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS VehicleFeature (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        vehicleId VARCHAR(191) NOT NULL,
        name VARCHAR(191) NOT NULL,
        INDEX idx_veh_feat (vehicleId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS PricingRule (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        vehicleId VARCHAR(191) NOT NULL,
        name VARCHAR(191) NOT NULL,
        startDate DATETIME(3) NOT NULL,
        endDate DATETIME(3) NOT NULL,
        pricePerDay DOUBLE NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX idx_veh_rule_dates (vehicleId, startDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS AvailabilityBlock (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        vehicleId VARCHAR(191) NOT NULL,
        startDate DATETIME(3) NOT NULL,
        endDate DATETIME(3) NOT NULL,
        reason VARCHAR(191) NOT NULL DEFAULT 'OWNER_BLOCK',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX idx_veh_avail_dates (vehicleId, startDate, endDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS Extra (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        description TEXT NULL,
        price DOUBLE NOT NULL DEFAULT 0,
        priceType VARCHAR(191) NOT NULL DEFAULT 'PER_RENTAL',
        icon VARCHAR(191) NULL,
        isGlobal BOOLEAN NOT NULL DEFAULT TRUE,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS VehicleExtra (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        vehicleId VARCHAR(191) NOT NULL,
        extraId VARCHAR(191) NOT NULL,
        price DOUBLE NOT NULL DEFAULT 0,
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        INDEX idx_veh_extra_pair (vehicleId, extraId)
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
