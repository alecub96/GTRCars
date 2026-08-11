export function getConfiguredAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredAdmin(email: string) {
  return getConfiguredAdminEmails().includes(email.trim().toLowerCase());
}
