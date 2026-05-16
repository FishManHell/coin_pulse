import { NextResponse } from "next/server";
import { requireApiRole } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import User from "@/entities/user/model/user";
import { ROLE_PERMISSIONS } from "@/shared/types/roles";

export async function GET() {
  const auth = await requireApiRole(ROLE_PERMISSIONS.canViewUsers);
  if ("error" in auth) return auth.error;

  await connectDB();
  const users = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(users);
}
