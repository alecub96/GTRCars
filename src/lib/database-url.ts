export function getDatabaseUrl() {
  return process.env.VANEANDO_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
}

export function isSupportedDatabaseUrl(databaseUrl = getDatabaseUrl()) {
  return /^(mysql|mariadb):\/\//i.test(databaseUrl);
}
