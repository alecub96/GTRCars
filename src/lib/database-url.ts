export function getDatabaseUrl() {
  const vaneandoUrl = process.env.VANEANDO_DATABASE_URL?.trim() || '';
  if (vaneandoUrl && isSupportedDatabaseUrl(vaneandoUrl)) {
    return vaneandoUrl;
  }
  const defaultUrl = process.env.DATABASE_URL?.trim() || '';
  if (defaultUrl && isSupportedDatabaseUrl(defaultUrl)) {
    return defaultUrl;
  }
  return vaneandoUrl || defaultUrl;
}

export function isSupportedDatabaseUrl(databaseUrl = getDatabaseUrl()) {
  return /^(mysql|mariadb):\/\//i.test(databaseUrl);
}
