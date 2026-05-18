import { describe, it, expect } from "vitest";
import { ROLE_PERMISSIONS, USER_ROLES, isValidRole } from "./roles";

describe("isValidRole", () => {
  it("accepts every UserRole literal", () => {
    for (const role of Object.values(USER_ROLES)) {
      expect(isValidRole(role)).toBe(true);
    }
  });

  it("rejects unknown strings", () => {
    expect(isValidRole("owner")).toBe(false);
    expect(isValidRole("")).toBe(false);
  });

  it("rejects non-string inputs", () => {
    expect(isValidRole(undefined)).toBe(false);
    expect(isValidRole(null)).toBe(false);
    expect(isValidRole(0)).toBe(false);
    expect(isValidRole({})).toBe(false);
  });
});

describe("ROLE_PERMISSIONS", () => {
  it("canAccessSettings — allows superadmin and admin only", () => {
    expect(ROLE_PERMISSIONS.canAccessSettings("superadmin")).toBe(true);
    expect(ROLE_PERMISSIONS.canAccessSettings("admin")).toBe(true);
    expect(ROLE_PERMISSIONS.canAccessSettings("developer")).toBe(false);
    expect(ROLE_PERMISSIONS.canAccessSettings("user")).toBe(false);
  });

  it("canViewUsers — allows superadmin and admin only", () => {
    expect(ROLE_PERMISSIONS.canViewUsers("superadmin")).toBe(true);
    expect(ROLE_PERMISSIONS.canViewUsers("admin")).toBe(true);
    expect(ROLE_PERMISSIONS.canViewUsers("developer")).toBe(false);
    expect(ROLE_PERMISSIONS.canViewUsers("user")).toBe(false);
  });

  it("canEditOtherProfile — allows superadmin and admin only", () => {
    expect(ROLE_PERMISSIONS.canEditOtherProfile("superadmin")).toBe(true);
    expect(ROLE_PERMISSIONS.canEditOtherProfile("admin")).toBe(true);
    expect(ROLE_PERMISSIONS.canEditOtherProfile("developer")).toBe(false);
    expect(ROLE_PERMISSIONS.canEditOtherProfile("user")).toBe(false);
  });

  it("canChangeOtherPassword — superadmin only", () => {
    expect(ROLE_PERMISSIONS.canChangeOtherPassword("superadmin")).toBe(true);
    expect(ROLE_PERMISSIONS.canChangeOtherPassword("admin")).toBe(false);
    expect(ROLE_PERMISSIONS.canChangeOtherPassword("developer")).toBe(false);
    expect(ROLE_PERMISSIONS.canChangeOtherPassword("user")).toBe(false);
  });

  it("canDeleteUser — superadmin only", () => {
    expect(ROLE_PERMISSIONS.canDeleteUser("superadmin")).toBe(true);
    expect(ROLE_PERMISSIONS.canDeleteUser("admin")).toBe(false);
    expect(ROLE_PERMISSIONS.canDeleteUser("developer")).toBe(false);
    expect(ROLE_PERMISSIONS.canDeleteUser("user")).toBe(false);
  });

  it("canChangeRole — superadmin can change any target role", () => {
    expect(ROLE_PERMISSIONS.canChangeRole("superadmin", "superadmin")).toBe(true);
    expect(ROLE_PERMISSIONS.canChangeRole("superadmin", "admin")).toBe(true);
    expect(ROLE_PERMISSIONS.canChangeRole("superadmin", "developer")).toBe(true);
    expect(ROLE_PERMISSIONS.canChangeRole("superadmin", "user")).toBe(true);
  });

  it("canChangeRole — admin can change anyone except superadmin", () => {
    expect(ROLE_PERMISSIONS.canChangeRole("admin", "superadmin")).toBe(false);
    expect(ROLE_PERMISSIONS.canChangeRole("admin", "admin")).toBe(true);
    expect(ROLE_PERMISSIONS.canChangeRole("admin", "developer")).toBe(true);
    expect(ROLE_PERMISSIONS.canChangeRole("admin", "user")).toBe(true);
  });

  it("canChangeRole — developer and user cannot change anyone's role", () => {
    for (const actor of ["developer", "user"] as const) {
      expect(ROLE_PERMISSIONS.canChangeRole(actor, "superadmin")).toBe(false);
      expect(ROLE_PERMISSIONS.canChangeRole(actor, "admin")).toBe(false);
      expect(ROLE_PERMISSIONS.canChangeRole(actor, "developer")).toBe(false);
      expect(ROLE_PERMISSIONS.canChangeRole(actor, "user")).toBe(false);
    }
  });
});
