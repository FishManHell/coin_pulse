import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireApiRole } from "@/entities/user/lib/require-api-user";
import connectDB, { isDuplicateKeyError } from "@/shared/lib/db";
import User from "@/models/User";
import { ROLE_PERMISSIONS, isValidRole, type UserRole } from "@/shared/types/roles";
import { apiError, ERRORS } from "@/shared/lib/api-response";
import { requireString } from "@/shared/lib/validate";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiRole(ROLE_PERMISSIONS.canViewUsers);
  if ("error" in auth) return auth.error;
  const actor = auth.user;

  try {
    const { id } = await params;
    const { name, email, role, password } = await req.json();

    const typeError =
      requireString(name, "name") ??
      requireString(email, "email") ??
      requireString(password, "password");
    if (typeError) return typeError;
    if (role !== undefined && !isValidRole(role)) return apiError("Invalid role", 400);

    await connectDB();
    const target = await User.findById(id);
    if (!target) return ERRORS.notFound();

    if (role && id === actor.id) {
      return apiError("Cannot change your own role", 400);
    }
    if (role && !ROLE_PERMISSIONS.canChangeRole(actor.role, target.role as UserRole)) {
      return apiError("Cannot change this role", 403);
    }
    if (password && !ROLE_PERMISSIONS.canChangeOtherPassword(actor.role)) {
      return ERRORS.forbidden();
    }

    if (name) target.name = name;
    if (email) target.email = email.toLowerCase();
    if (role) target.role = role;
    if (password) target.password = await bcrypt.hash(password, 10);

    await target.save();
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    if (isDuplicateKeyError(err)) return apiError("Email already in use", 400);
    console.error("admin user PATCH error:", err);
    return ERRORS.serverError();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiRole(ROLE_PERMISSIONS.canDeleteUser);
  if ("error" in auth) return auth.error;
  const actor = auth.user;

  try {
    const { id } = await params;
    if (id === actor.id) return apiError("Cannot delete yourself", 400);

    await connectDB();
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) return ERRORS.notFound();

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("admin user DELETE error:", err);
    return ERRORS.serverError();
  }
}
