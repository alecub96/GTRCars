export function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || '';
}

export function isSupportedDatabaseUrl(databaseUrl = getDatabaseUrl()) {
  return /^(mysql|mariadb):\/\//i.test(databaseUrl);
}
