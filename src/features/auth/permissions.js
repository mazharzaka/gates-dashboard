export const PERMISSIONS = {
  guard: {
    viewAllGates: false,
    toggleGate: true,
    viewAllLogs: false,
    exportLogs: false,
    viewAdminPage: false,
  },
  admin: {
    viewAllGates: true,
    toggleGate: true,
    viewAllLogs: true,
    exportLogs: true,
    viewAdminPage: true,
  },
};

export function can(role, permission) {
  return Boolean(PERMISSIONS[role]?.[permission]);
}

