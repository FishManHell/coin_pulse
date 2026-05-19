export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  DEVELOPER: "developer",
  USER: "user",
} as const;

export const ALL_ROLES = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.DEVELOPER,
  USER_ROLES.USER,
] as const;

export type UserRole = (typeof ALL_ROLES)[number];

export const isValidRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (ALL_ROLES as readonly string[]).includes(value);

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
};
