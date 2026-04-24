import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import User from "../../../../../../models/User";
import { ROLE_PERMISSIONS, USER_ROLES, type UserRole } from "@/shared/types/roles";

type SessionUser = { id: string; role: UserRole };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as SessionUser | undefined;

  if (!actor?.role || !ROLE_PERMISSIONS.canViewUsers(actor.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, email, role, password } = body;

  await connectDB();
  const target = await User.findById(id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Role change permission check
  if (role && !ROLE_PERMISSIONS.canChangeRole(actor.role, target.role as UserRole)) {
    return NextResponse.json({ error: "Cannot change this role" }, { status: 403 });
  }

  // Password change — superadmin only
  if (password && !ROLE_PERMISSIONS.canChangeOtherPassword(actor.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (name) target.name = name;
  if (email) target.email = email.toLowerCase();
  if (role && Object.values(USER_ROLES).includes(role)) target.role = role;
  if (password) {
    const bcrypt = await import("bcryptjs");
    target.password = await bcrypt.hash(password, 10);
  }

  await target.save();
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as SessionUser | undefined;

  if (!actor?.role || !ROLE_PERMISSIONS.canDeleteUser(actor.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === actor.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  await connectDB();
  const result = await User.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
