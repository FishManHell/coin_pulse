import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import User from "../../../../../models/User";
import { ROLE_PERMISSIONS, type UserRole } from "@/shared/types/roles";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: UserRole } | undefined)?.role;

  if (!role || !ROLE_PERMISSIONS.canViewUsers(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const users = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(users);
}
