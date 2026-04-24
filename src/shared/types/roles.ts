export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  DEVELOPER: "developer",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  developer: "Developer",
  user: "User",
};

export const ROLE_PERMISSIONS = {
  canAccessSettings: (role: UserRole) =>
    role === USER_ROLES.SUPERADMIN || role === USER_ROLES.ADMIN,

  canViewUsers: (role: UserRole) =>
    role === USER_ROLES.SUPERADMIN || role === USER_ROLES.ADMIN,

  canChangeRole: (role: UserRole, targetRole: UserRole) => {
    if (role === USER_ROLES.SUPERADMIN) return true;
    if (role === USER_ROLES.ADMIN) return targetRole !== USER_ROLES.SUPERADMIN;
    return false;
  },

  canChangeOtherPassword: (role: UserRole) =>
    role === USER_ROLES.SUPERADMIN,

  canDeleteUser: (role: UserRole) =>
    role === USER_ROLES.SUPERADMIN,

  canEditOtherProfile: (role: UserRole) =>
    role === USER_ROLES.SUPERADMIN || role === USER_ROLES.ADMIN,
} as const;
