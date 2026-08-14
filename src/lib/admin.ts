const DEFAULT_ADMIN_EMAILS = [
  'admin@vaneando.com',
  'vaneando@vaneando.com',
  'alecub96@gmail.com',
];

export function getConfiguredAdminEmails() {
  const envEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envEmails]));
}

export function isConfiguredAdmin(email: string) {
  return getConfiguredAdminEmails().includes(email.trim().toLowerCase());
}
