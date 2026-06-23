export function isDatabaseConfigured() {
  return Boolean(process.env.UTKRISHT_DB_PRISMA_DATABASE_URL);
}
