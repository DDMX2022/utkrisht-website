function isUsableDatabaseUrl(value?: string) {
  if (!value) return false;

  const normalized = value.toLowerCase();

  return !(
    normalized.includes('@host') ||
    normalized.includes('host:5432') ||
    normalized.includes('user:password') ||
    normalized.includes('username:password')
  );
}

export function applyDatabaseEnvAliases() {
  const databaseUrl =
    process.env.UTKRISHT_DB_PRISMA_DATABASE_URL || process.env.DATABASE_URL;
  const directUrl =
    process.env.UTKRISHT_DB_POSTGRES_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (
    isUsableDatabaseUrl(databaseUrl) &&
    !process.env.UTKRISHT_DB_PRISMA_DATABASE_URL
  ) {
    process.env.UTKRISHT_DB_PRISMA_DATABASE_URL = databaseUrl;
  }

  if (isUsableDatabaseUrl(directUrl) && !process.env.UTKRISHT_DB_POSTGRES_URL) {
    process.env.UTKRISHT_DB_POSTGRES_URL = directUrl;
  }
}

export function isDatabaseConfigured() {
  return (
    isUsableDatabaseUrl(process.env.UTKRISHT_DB_PRISMA_DATABASE_URL) ||
    isUsableDatabaseUrl(process.env.DATABASE_URL)
  );
}
