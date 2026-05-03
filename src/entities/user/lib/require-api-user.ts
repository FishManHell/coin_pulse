import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";
import type { SessionUser } from "./require-user";
import type { UserRole } from "@/shared/types/roles";

type ApiAuthResult = { user: SessionUser } | { error: NextResponse };

export async function requireApiUser(): Promise<ApiAuthResult> {
  const session = await getServerSession(authOptions);
  const user = session?.user as Partial<SessionUser> | undefined;
  if (!user?.id || !user.role) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user: user as SessionUser };
}

export async function requireApiRole(
  check: (role: UserRole) => boolean
): Promise<ApiAuthResult> {
  const auth = await requireApiUser();
  if ("error" in auth) return auth;
  if (!check(auth.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return auth;
}
