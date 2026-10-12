// Optional capabilities for future client templates; no login or real accounts in this MVP.
export const templateModules = Object.freeze({
  auth: false,
  users: false,
  roles: false,
  reports: true,
  branding: true,
  sync: false,
});
export const rolePermissions = Object.freeze({
  owner: ['read', 'write', 'export', 'configure'],
  editor: ['read', 'write'],
  viewer: ['read'],
});
export function hasPermission(role, action) {
  return rolePermissions[role]?.includes(action) ?? false;
}
export function createSessionService(provider) {
  return {
    async signIn(credentials) {
      if (!provider) throw new Error('Autenticación no habilitada.');
      return provider.signIn(credentials);
    },
    async signOut() {
      return provider?.signOut();
    },
    async currentUser() {
      return provider ? provider.currentUser() : null;
    },
  };
}
export function userDisplayName(user) {
  return user?.displayName || 'Usuario local';
}
export function tasksCsv(state) {
  const cell = (value) => {
    let content = String(value ?? '');
    // Prevent spreadsheet formula execution in exported text.
    if (/^[=+@\-\t\r\n]/.test(content)) content = "'" + content;
    return `"${content.replaceAll('"', '""')}"`;
  };
  return [
    ['Actividad', 'Tipo', 'Fecha', 'Curso', 'Estado'],
    ...state.tasks.map((t) => [
      t.title,
      t.kind,
      t.date,
      state.courses.find((c) => c.id === t.courseId)?.name || '',
      t.done ? 'Completada' : 'Pendiente',
    ]),
  ]
    .map((row) => row.map(cell).join(','))
    .join('\r\n');
}
